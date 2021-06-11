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
		const sql = "SELECT * FROM survey S, admin A WHERE S.ref_A = A.id";
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
			console.log(this.lastID)
			console.log(questions);
			console.log("PROVAPROVAPROVA")
			for (let i = 0; i < questions.length; i++) {
				const sql2 =
					"INSERT INTO question (ref_s, question, min, max, open, required) VALUES (?, ?, ?, ?, ?, ?)";
				console.log("DB GOIN")
				console.log(questions[i].question)
					db.run(
					sql2,
					[
						idS,
						questions[i].question,
						questions[i].min,
						questions[i].max,
						questions[i].open,
						questions[i].required,
					],
					function (err) {
						if (err) {
							console.log("addio tensing")
							reject(err);
							return;
						}
						console.log("CI SIAMO? ", idQ)
						let idQ = this.lastID;
						if (questions[i].answers != null) {
							const sql3 =
								"INSERT INTO option(ref_q, option_text) VALUES (?, ?)";
							const sql4 =
								"INSERT INTO answer(ref_q, answer_text, ref_as, ref_op) VALUES (?,?,?,?)";
							for (let i = 0; i < questions[i].answers.length; i++) {
								db.run(sql3, [idQ, questions[i].answers[i]], function (err) {
									if (err) {
										reject(err);
										return;
									}
									let idOP = this.lastID;
									db.run(sql4, [idQ, "", null, idOP], function (err) {
										if (err) {
											reject(err);
											return;
										}
									});
								});
							}
						} else {
							const sql3 =
								"INSERT INTO answer(ref_q, answer_text, ref_as, ref_op) VALUES (?,?,?,?)";
							db.run(sql3, [idQ, "", null, null], function (err) {
								if (err) {
									reject(err);
									return;
								}
							});
						}
					}
				);
			}
			resolve(idS);
		});
	});
};

exports.getSurveyById = (id) => {
	return new Promise((resolve, reject) => {
		console.log("PROVA: ",id)
		// Obtain all the questions for a given Survey
		const sql =
			"SELECT * FROM question Q WHERE Q.ref_s = ?";
		db.all(sql, [id], (err, rows) => {
			if (err) {
				reject(err);
				return;
			}
			console.log(rows);
			let idQ;
			let survey;
			let options = [];
			for (let i=0; i<rows.length; i++){
				console.log("CURR:", i,  rows[i]);

				if (rows[i].open == 1){
					// Non ho bisogno di prendere le option
					
					options.push(null);
				}
				else if(rows[i].open == 0){
					console.log("ID_Q:" ,rows[i].id)
					idQ = rows[i].id;
					const sql2 = "SELECT * FROM option O WHERE O.ref_q = ?"
					db.all(sql2, [idQ], (err, rows2) => {
						if (err) {
							reject(err);
							return;
						}
						console.log("AO", rows2)
						options.push(rows2)
					});
				}
			}
			console.log("VRIMM:", options)
			survey = rows.map((e) => ({
				question: e.question,
				min: e.min,
				max: e.max,
				open: e.open,
				required: e.required,
				options: options,
			}));
			console.log("***********************", survey)
			resolve(survey);
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

