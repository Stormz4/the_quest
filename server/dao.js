"use strict";
/* Data Access Object (DAO) module for accessing courses and exams */

const sqlite = require("sqlite3");
const bcrypt = require("bcrypt");

// open the database
const db = new sqlite.Database("surveys.db", (err) => {
	if (err) throw err;
});

exports.getAdmin = (email, password) => {
	return new Promise((resolve, reject) => {
		const sql = "SELECT * FROM admin WHERE email = ?";

		db.get(sql, [email], (err, row) => {
			if (err) reject(err);
			else if (row === undefined) {
				resolve(false);
			} else {
				const user = { id: row.id, username: row.email, name: row.name };
				// check the hashes with an async call
				bcrypt.compare(password, row.password).then((result) => {
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
				// by default, the local strategy looks for "username"
				const user = { id: row.id, username: row.email, name: row.name };
				resolve(user);
			}
		});
	});
};

// Gets all the survies and the admin's name regarding a certain survey
exports.getAllSurveys = () => {
	return new Promise((resolve, reject) => {
		const sql = `SELECT S.id, S.title, A.name 
		FROM survey S, admin A 
		WHERE S.ref_A = A.id`;
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
			resolve(surveys);
		});
	});
};

// Insert a survey, the questions made for it and all the options
exports.createSurvey = (title, admin, questions) => {
	return new Promise((resolve, reject) => {
		const sql = "INSERT INTO survey (ref_a, title) VALUES(?, ?)";
		db.run(sql, [admin, title], function (err) {
			if (err) {
				reject(err);
				return;
			}
			resolve(this.lastID);
		});
	});
};

exports.createQuestion = (idS, question, index) => {
	return new Promise((resolve, reject) => {
		const sql2 =
			// The order value will be the index of the element in the array
			"INSERT INTO question (ref_s, question, min, max, open, required, position) VALUES (?, ?, ?, ?, ?, ?, ?)";
		db.run(
			sql2,
			[
				idS,
				question.question,
				question.min,
				question.max,
				question.open,
				question.required,
				index,
			],
			function (err) {
				if (err) {
					reject(err);
					return;
				}
				resolve(this.lastID);
			}
		);
	});
};

exports.createAnswers = (idQ, answer) => {
	return new Promise((resolve, reject) => {
		const sql3 = "INSERT INTO option(ref_q, option_text) VALUES (?, ?)";
		db.run(sql3, [idQ, answer], function (err) {
			if (err) {
				reject(err);
				return;
			}
			resolve(this.lastID);
		});
	});
};

// Create a new answer sheet and insert all the answers that have been made.
exports.submitSurvey = (answers, survey, name) => {
	return new Promise((resolve, reject) => {
		const sql = "INSERT INTO answer_sheet (name, ref_s) VALUES(?, ?)";
		db.run(sql, [name, survey.id], function (err) {
			if (err) {
				reject(err);
				return;
			}
			let idA = this.lastID;
			// Iterate over each answers
			const sql2 =
				"INSERT INTO answer (ref_q, answer_text, ref_as, ref_op) VALUES (?, ?, ?, ?)";
			if (answers.length > 0) {
				for (const answer of answers) {
					db.run(
						sql2,
						[answer.id_question, answer.answer, idA, answer.ref_op],
						function (err) {
							if (err) {
								reject(err);
								return;
							}
							resolve(idA);
						}
					);
				}
			}
			// In the case where a survey contains only a question, which is not required.
			else {
				db.run(sql2, [null, " ", idA, null], function (err) {
					if (err) {
						reject(err);
						return;
					}
					resolve(idA);
				});
			}
		});
	});
};

// Get a survey by it's id and all of its questions
exports.getSurveyById = (id) => {
	return new Promise((resolve, reject) => {
		// Obtain all the questions for a given Survey

		const sql = `SELECT Q.id, Q.question, Q.min, Q.max, O.ref_q, O.id as id_option,
						Q.required, Q.open, O.option_text
					FROM question Q 
						LEFT JOIN option O on O.ref_Q = Q.id  
					WHERE Q.ref_s = ?
					ORDER BY Q.position, O.id  ASC`;

		// First ordered by the position, by the option id
		db.all(sql, [id], (err, rows) => {
			if (err) {
				reject(err);
				return;
			}
			let survey;
			let options = [];
			let i = 0;

			// Create an array of options, where all the options data will be stored.
			// If a question is open, null will be pushed. Otherwise,
			// a new element will be pushed containing:
			// index, the id of the survey, the id of the option, the ref of the question, the text of the option.
			// This array will be handled properly by the front end.
			// Duplicates and null elements will be removed.
			// This solution was made in order to obtain only one resolve.

			for (i; i < rows.length; i++) {
				if (rows[i].open == 1) {
					options.push(null);
				} else if (rows[i].open == 0) {
					options.push({
						index: i,
						id: rows[i].id,
						id_option: rows[i].id_option,
						ref_q: rows[i].ref_q,
						option_text: rows[i].option_text,
					});
				}
			}

			survey = rows.map((e) => ({
				id: e.id,
				question: e.question,
				min: e.min,
				ref_q: e.ref_q,
				max: e.max,
				open: e.open,
				required: e.required,
				options: options,
			}));

			resolve(survey);
		});
	});
};

exports.getAllSurveysById = (id) => {
	return new Promise((resolve, reject) => {
		const sql = `SELECT S.id, S.title, A.name, count(A2.id) AS n_submissions 
			FROM admin A, survey S 
				LEFT JOIN answer_sheet A2 on A2.ref_s = S.id 
			WHERE A.id = ? AND S.ref_A = A.id 
			GROUP BY S.id`;
		db.all(sql, [id], (err, rows) => {
			if (err) {
				reject(err);
				return;
			}
			const surveys = rows.map((e) => ({
				id: e.id,
				title: e.title,
				adminName: e.name,
				n_submissions: e.n_submissions,
			}));

			resolve(surveys);
		});
	});
};

exports.getAnswerSheetsById = (id) => {
	return new Promise((resolve, reject) => {
		// Obtain all the questions for a given Survey
		const sql = `SELECT A.id, A.ref_as, A.answer_text, A.ref_q, A.ref_op, A2.name, A2.ref_s 
			FROM answer A, answer_sheet A2 WHERE A2.ref_s = ? AND A.ref_as = A2.id`;

		db.all(sql, [id], (err, rows) => {
			if (err) {
				reject(err);
				return;
			}

			const answers = rows.map((e) => ({
				id: e.id,
				ref_as: e.ref_as,
				answer_text: e.answer_text,
				ref_q: e.ref_q,
				name: e.name,
				ref_s: e.ref_s,
				ref_op: e.ref_op,
			}));

			resolve(answers);
		});
	});
};
