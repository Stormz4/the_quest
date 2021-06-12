"use strict";
/* Data Access Object (DAO) module for accessing courses and exams */

const sqlite = require("sqlite3");
const bcrypt = require("bcrypt");

// open the database
const db = new sqlite.Database("surveys.db", (err) => {
	if (err) throw err;
});

exports.getAdmin = (email, password) => {
	console.log(email);
	return new Promise((resolve, reject) => {
		const sql = "SELECT * FROM admin WHERE email = ?";

		db.get(sql, [email], (err, row) => {
			if (err) reject(err);
			else if (row === undefined) {
				resolve(false);
			} else {
				const user = { id: row.id, username: row.email, name: row.name };
				// check the hashes with an async call, given that the operation may be CPU-intensive (and we don't want to block the server)
				bcrypt.compare(password, row.password).then((result) => {
					console.log(result);
					if (result) resolve(user);
					else resolve(false);
				});
			}
		});
	});
};

exports.getAdminById = (id) => {
	return new Promise((resolve, reject) => {
		const sql = "SELECT * FROM admin WHERE id = ?";
		db.get(sql, [id], (err, row) => {
			if (err) reject(err);
			else if (row === undefined) resolve({ error: "User not found." });
			else {
				// by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
				const user = { id: row.id, username: row.email, name: row.name };
				resolve(user);
			}
		});
	});
};

exports.getAllSurveys = () => {
	return new Promise((resolve, reject) => {
		const sql = "SELECT S.id, S.title, A.name FROM survey S, admin A WHERE S.ref_A = A.id";
		db.all(sql, [], (err, rows) => {
			if (err) {
				reject(err);
				return;
			}

			const surveys = rows.map((e) => ({
				id: e.id,
				title: e.title,
				adminName: e.name,
			}));
			console.log(surveys);
			resolve(surveys);
		});
		//);
		//});
	});
};

exports.createSurvey = (title, admin, questions) => {
	// {description:, important:, private:, deadline:, user:,}
	return new Promise((resolve, reject) => {
		const sql = "INSERT INTO survey (ref_a, title) VALUES(?, ?)";
		db.run(sql, [admin, title], function (err) {
			if (err) {
				reject(err);
				return;
			}
			let idS = this.lastID;
			for (let i = 0; i < questions.length; i++) {
				const sql2 =
					"INSERT INTO question (ref_s, question, min, max, open, required) VALUES (?, ?, ?, ?, ?, ?)";
					db.run(
					sql2,[idS,
						questions[i].question,
						questions[i].min,
						questions[i].max,
						questions[i].open,
						questions[i].required,
					],
					function (err) {
						if (err) {
							reject(err);
							return;
						}
						let idQ = this.lastID;
						console.log("PROVA QUESTION");
						console.log(questions)
						console.log(questions[i])
						if (questions[i] != undefined && questions[i].answers != null && questions[i].answers!=undefined) {

							const sql3 =
								"INSERT INTO option(ref_q, option_text) VALUES (?, ?)";
							console.log(questions[i].answers)
							
							for (let j = 0; j < questions[i].answers.length; j++) {
								db.run(sql3, [idQ, questions[i].answers[j]], function (err) {
									if (err) {
										reject(err);
										return;
									}
									resolve(idS);
								});
							}
						}
					}
				);
			}
			//resolve(idS);
		});
	});
};

exports.getSurveyById = (id) => {
	return new Promise((resolve, reject) => {

		// Obtain all the questions for a given Survey
		const sql =
			"SELECT * FROM question Q WHERE Q.ref_s = ?";
		db.all(sql, [id], (err, rows) => {
			if (err) {
				reject(err);
				return;
			}
			let idQ;
			let survey;
			let options = [];
			let i=0;
			let forward=true;
			while (i<rows.length){
				if (rows[i].open == 1)
					options.push(null)
				else if (rows[i].open == 0){
					idQ = rows[i].id;
					const sql2 = "SELECT * FROM option O WHERE O.ref_q = ?"
					db.all(sql2, [idQ], (err, rows2) => {
						if (err) {
							reject(err);
							return;
						}
						options.push(rows2);

						survey = rows.map((e) => ({
								id: e.id,
								question: e.question,
								min: e.min,
								max: e.max,
								open: e.open,
								required: e.required,
								options: options,
						}));
						console.log("AOOOO", survey)
						resolve(survey);
					});
				}
				i++;
			}

		});

	});
};

exports.getAllSurveysById = (id) => {
	console.log("USER:");
	console.log(id);
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT * FROM survey S, admin A WHERE A.id = ? AND S.ref_A = A.id ";
		db.all(sql, [id], (err, rows) => {
			if (err) {
				reject(err);
				return;
			}
			console.log(rows);
			const surveys = rows.map((e) => ({
				id: e.id,
				title: e.title,
				adminName: e.name,
			}));

			resolve(surveys);
		});
	});
};

