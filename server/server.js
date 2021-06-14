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
 * 		retrieve a survey and his questions/answers by it's id
 * 
 * POST /api/surveys
 * 		insert a survey for a given admin
 * 
 * 
 * POST /api/login
 * 		
 * 
 * DELETE /api/login/current
 * 
 * 
 * GET /api/login/current
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * *****************************************************
 * */


app.get('/api/surveys', async (req, res) => {
    await dao.getAllSurveys()
    .then(surveys => res.json(surveys))
    .catch(()=> res.status(500).json("Database unreachable"));
});

app.get("/api/surveys/admin", isLoggedIn, async (req, res) => {
	console.log(req.user.id);

	await dao
		.getAllSurveysById(req.user.id)
		.then((surveys) => res.json(surveys))
		.catch(() => res.status(500).json("Database unreachable"));
});

app.get(
	"/api/surveys/id=:id",
	[check("id").isInt({ min: 0 })],
	async (req, res) => {
		try{
			let survey = await dao.getSurveyById(req.params.id);
			res.json(survey)
		}catch(err){
			res.status(500).end()
		}
	}
);


app.post(
	"/api/surveys",
	[check("title").isString(), 
	check("questions").custom(questions =>{
		let isValid = true;
		if (questions.length === 0){
			throw new Error("Questions must contain at least 1 question.")
		}
		for (const question of questions) {
			console.log("DOMANDA:" ,question)
			//!variable -> variable == null && variable == undefined, not usable if a var can be 0
			if (!question.question || question.open === null || question.open === undefined || !question.max ){
				console.log("Crasho 1")
				isValid = false;
				break;
			}
			
			if (question.open == 1){
				if (question.min != null || question.required === null || question.required === undefined 
					|| question.answers != null || question.max < 0 || question.max > 200){
					console.log("Crasho 2");
					isValid = false;
					break;
				}
			}
			else{
				if (question.required != null || !question.answers || question.min === null || 
					question.min===undefined || question.min < 0 || question.max > 10 || question.answers.length > 10){
					console.log("Crasho 3");
					isValid = false;
					break;
				}
			}
		}
		if (!isValid){
			throw new Error("An error has been found.")
		}
		else{
			return true;
		}
	})


	],
	isLoggedIn,
	async (req, res) => {
		const errors = validationResult(req);
		console.log("BODY:" , req.body)
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		try {
			await dao.createSurvey(req.body.title, req.user.id, req.body.questions);
			res.status(201).end();
		} catch (err) {
			console.log(err);
			res.status(503).json({
				error: `Database error during the creation of the survey.`,
			});
		}
	}
);

//login
app.post('/api/login',[
    check('email').isEmail(),
    check('password').isString()],function (req, res, next) {
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
			return res.json(req.user);
		});
	})(req, res, next);
});

// DELETE /login/current
// logout
app.delete("/api/login/current", (req, res) => {
	req.logout();
	res.end();
});

app.get("/api/login/current", (req, res) => {
	if (req.isAuthenticated()) {
		res.status(200).json(req.user);
	} else res.status(401).json({ error: "Unauthenticated user!" });
});

app.listen(PORT, () =>
	console.log(`Server running on http://localhost:${PORT}/`)
);
