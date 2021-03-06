const express = require("express");
const morgan = require("morgan"); // logging middleware
const { check, validationResult } = require("express-validator"); // validation middleware

const passport = require("passport"); // auth middleware
const LocalStrategy = require("passport-local").Strategy; // username and password for login
const session = require("express-session"); // enable sessions

const dao = require("./dao");
const PORT = 3001;

app = new express();
app.use(morgan("dev"));
app.use(express.json());

passport.use(
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
		},
		function (username, password, done) {
			dao.getAdmin(username, password).then((user) => {
				if (!user)
					return done(null, false, {
						message: "Incorrect username and/or password.",
					});

				return done(null, user);
			});
		}
	)
);

// serialize and de-serialize the user (user object <-> session)

// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
	done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
	dao
		.getAdminById(id)
		.then((user) => {
			done(null, user); // this will be available in req.user
		})
		.catch((err) => {
			done(err, null);
		});
});

// set up the session
app.use(
	session({
		// by default, Passport uses a MemoryStore to keep track of the sessions
		secret:
			"a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie",
		resave: false,
		saveUninitialized: false,
	})
);

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) return next();

	return res.status(401).json({ error: "not authenticated" });
};

/****** API *****
 * *****************************************************
 * GET /api/surveys
 *     retrieves all the surveys made by every user
 *
 * GET /api/surveys/admin
 * 		retrieves all the surveys made by an admin, using the session cookie
 *
 * GET /api/surveys/id=:id
 * 		retrieves a survey and his questions/answers by it's id
 *
 * GET /api/answers/id=:id
 * 		retrieves all the answer sheets for a specific survey
 *
 * POST /api/surveys
 * 		insert a survey for a given admin
 *
 * POST /api/surveys/submit
 * 		submit a survey made by an user
 *
 * POST /api/login
 * 		Send the credentials in order to log in
 *
 * DELETE /api/login/current
 * 		If the user is logged in, it logs him out
 *
 * GET /api/login/current
 * 		Retrieves the information regarding a logged in user
 *
 * *****************************************************
 * */

// Get all the surveys
app.get("/api/surveys", async (req, res) => {
	await dao
		.getAllSurveys()
		.then((surveys) => res.json(surveys))
		.catch(() => res.status(500).json("Database unreachable"));
});

// Get all the surveys made by a certain admin. Admin id will be retrieved from the session
app.get("/api/surveys/admin", isLoggedIn, async (req, res) => {
	await dao
		.getAllSurveysById(req.user.id)
		.then((surveys) => res.json(surveys))
		.catch(() => res.status(500).json("Database unreachable"));
});

// Get the survey data by a certain survey id
app.get(
	"/api/surveys/id=:id",
	[check("id").isInt({ min: 0 })],
	async (req, res) => {
		try {
			let survey = await dao.getSurveyById(req.params.id);
			res.json(survey);
		} catch (err) {
			res.status(500).end();
		}
	}
);

// Get all the answer sheets for a certain survey id
app.get(
	"/api/answers/id=:id",
	[check("id").isInt({ min: 0 })],
	isLoggedIn,
	async (req, res) => {
		try {
			let answers = await dao.getAnswerSheetsById(req.params.id);
			res.json(answers);
		} catch (err) {
			res.status(500).end();
		}
	}
);

// Create a survey
app.post(
	"/api/surveys",
	[
		check("title").isString(),
		check("questions").custom((questions) => {
			// Custom check in order to verify every field in a proper way.
			let isValid = true;
			if (questions.length === 0) {
				throw new Error("Questions must contain at least 1 question.");
			}
			for (const question of questions) {
				//!variable -> variable == null && variable == undefined, not usable if a var can be 0
				if (
					!question.question ||
					question.open === null ||
					question.open === undefined ||
					!question.max
				) {
					isValid = false;
					break;
				}

				// Open question
				if (question.open == 1) {
					if (
						question.min != null ||
						question.required === null ||
						question.required === undefined ||
						question.answers != null ||
						question.max <= 0 ||
						question.max > 200
					) {
						isValid = false;
						break;
					}
				}
				// Closed question
				else {
					if (
						question.required != null ||
						!question.answers ||
						question.min === null ||
						question.min === undefined ||
						question.min < 0 ||
						question.max > 10 ||
						question.answers.length > 10
					) {
						isValid = false;
						break;
					}
				}
			}
			if (!isValid) {
				throw new Error("An error has been found.");
			} else {
				return true;
			}
		}),
	],
	isLoggedIn,
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		try {
			/* 
				First, I need to insert the Survey and obtain it's hid.
				Then, for each question, call the dao function and insert a question.
				In this way, the handling of multiple resolve is not needed.
				Then, for each question, verify if it's open or closed. 
				If it's closed, insert the answers (depending on the lenght of the answers array)
			*/

			let questions = req.body.questions;
			let idS = await dao.createSurvey(req.body.title, req.user.id, questions);
			let idQ;
			for (let i = 0; i < questions.length; i++) {
				idQ = await dao.createQuestion(idS, questions[i], i);
				if (questions[i].open === 0) {
					for (let j = 0; j < questions[i].answers.length; j++) {
						await dao.createAnswers(idQ, questions[i].answers[j]);
					}
				}
			}
			res.status(201).end();
		} catch (err) {
			console.log(err);
			res.status(503).json({
				error: `Database error during the creation of the survey.`,
			});
		}
	}
);

// Insert a submission for a certain survey
app.post(
	"/api/surveys/submit",
	[
		check("name").isString(),
		check("answers").custom((answers) => {
			// Custom check in order to verify every field in a proper way.
			if (answers != undefined && answers.length > 0) {
				for (const answer of answers) {
					// answer.answer.lenght <=0 or !answer.answer is not a good check, since a user can write in an optional field
					// and then delete everything. In that case, an example of input could be:
					// {id_question: x, answer: "", open: 1} which will cause an error.
					if (
						answer.id_question <= 0 ||
						!answer.id_question ||
						answer.open === null ||
						answer.open === undefined ||
						answer.open > 1 ||
						answer.open < 0
					)
						throw new Error("An error has been found. Try again");
				}
			}
			return true;
		}),
		check("survey").custom((survey) => {
			if (survey.id <= 0) {
				throw new Error("Id is not a valid int");
			}
			if (survey.title.length === 0) {
				throw new Error("Title must be a valid string");
			}
			if (survey.adminName.length === 0) {
				throw new Error("Admin name must be a valid string");
			}
			return true;
		}),
	],

	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		try {
			await dao.submitSurvey(req.body.answers, req.body.survey, req.body.name);
			res.status(201).end();
		} catch (err) {
			console.log(err);
			res.status(503).json({
				error: `Database error during the submission of the survey.`,
			});
		}
	}
);

//login
app.post(
	"/api/login",
	[check("email").isEmail(), check("password").isString()],
	function (req, res, next) {
		passport.authenticate("local", (err, user, info) => {
			if (err) return next(err);

			if (!user) {
				// display wrong login messages
				return res.status(401).json(info);
			}
			// success, perform the login
			req.login(user, (err) => {
				if (err) return next(err);

				// req.user contains the authenticated user, we send all the user info back
				// this is coming from userDao.getUser()
				return res.json(req.user.name);
			});
		})(req, res, next);
	}
);

// DELETE /login/current
// logout
app.delete("/api/login/current", isLoggedIn, (req, res) => {
	req.logout();
	res.end();
});

app.get("/api/login/current", (req, res) => {
	if (req.isAuthenticated()) {
		res.status(200).json(req.user.name);
	} else res.status(401).json({ error: "Unauthenticated user!" });
});

app.listen(PORT, () =>
	console.log(`Server running on http://localhost:${PORT}/`)
);
