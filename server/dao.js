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

			let questions;

			/*
      db.all(
				"SELECT * FROM survey S, question Q, answer A WHERE  S.id = Q.ref_s AND Q.id=A.ref_q", [], (err, rows) =>{
          if (err) {
							reject(err);
							return;
					}
          console.log("AAAAAAAAAAAAAAAAAAA")
          console.log(rows)
          questions = rows;
          */
			const surveys = rows.map((e) => ({
				id: e.id,
				title: e.title,
				adminName: e.name,
				question: questions,
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
			console.log(questions);
			for (let i = 0; i < questions.length; i++) {
				const sql2 =
					"INSERT INTO question (ref_s, question, min, max, open, required) VALUES (?, ?, ?, ?, ?)";
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
							reject(err);
							return;
						}
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
