import { useState } from "react";
import { Col, Row, ListGroup, Button } from "react-bootstrap";
import ModalAnswerSheet from "./ModalAnswerSheet";
import API from "./API";

/*

	This component is used to render every survey contained in a surveyList.
	Initially, the list only contains the id, the title and the admin that made the survey.
	If the button is clicked, the API is called and all the other data are retrieved from the back end.
	If an user is logged, all the answer sheets will be gathered from the back end.
	
	This component also handles and transform the survey/answer sheets objects in order to work with them in an easier manner.
	(All the questions and, if it's made by an admin, all the answer sheets related to the survey.)

*/

function SurveyRow(props) {
	const [show, setShow] = useState(false);
	const [answersSheet, setAnswersSheet] = useState([]);
	const [loading, setLoading] = useState(true);

	const handleSurvey = async (id) => {
		const getSurveyById = async (id) => {
			const survey = await API.getSurveyById(id);

			/* Survey:
			0:
				id: 7
				max: 3
				min: 1
				open: 0
				options: Array(5)
					0: {index: 0, id: 7, ref_q: 7, option_text: "Dark chocolate"}
					...
				length: 5
				question: "Which is the best chocolate?"
				ref_q: 7
				required: null
				1: {id: 7, question: "Which is the best chocolate?", min: 1, ref_q: 7, max: 3, …}
				2: {id: 7, question: "Which is the best chocolate?", min: 1, ref_q: 7, max: 3, …}
				3: {id: 8, question: "Would you like to say something?", min: null, ref_q: null, max: 100, …}
				4: {id: 9, question: "Why do you like chocolate?", min: null, ref_q: null, max: 200, …}
			*/
			// If a question is open, it will be present multiple times.
			// I remove in this case all the rows that contain a duplicated id
			// filter((element, index, array) => { ... } )
			let s2 = survey.filter(
				(element, index, array) =>
					array.findIndex((t) => t.id === element.id) === index
			);
			/*
			s2:
				0: {id: 7, question: "Which is the best chocolate?", min: 1, ref_q: 7, max: 3, …}
				1: {id: 8, question: "Would you like to say something?", min: null, ref_q: null, max: 100, …}
				2: {id: 9, question: "Why do you like chocolate?", min: null, ref_q: null, max: 200, …}
			*/
			props.setSurvey(s2);
		};

		const getAnswerSheetsById = async (id) => {
			const answersSheet = await API.getAnswerSheetsById(id);

			/*
				answersSheet={
					0: {
						answer_text: "Of course!"
						id: 45
						name: "Maria"
						ref_as: 27
						ref_op: null
						ref_q: 7
						ref_s: 14
					}
					1: {
						answer_text: "Dark chocolate"
						id: 46
						name: "Maria"
						ref_as: 27
						ref_op: 53
						ref_q: 8
						ref_s: 14
					},
					{...}, ...
				}

			reduce((accumulator, currentValue) => { ... } )
			Reduce is used to group under different values of ref_answer sheet
			in order to have an array where, for each index, there is a different answer sheet.

			*/
			let arr = answersSheet.reduce((acc, currVal) => {
				acc[currVal.ref_as] = [...(acc[currVal.ref_as] || []), currVal];
				return acc;
			}, {});

			/*
			arr={
				27: Array(6)
					0: {id: 45, ref_as: 27, answer_text: "Of course!", ref_q: 7, name: "Maria", …}
					1: {id: 46, ref_as: 27, answer_text: "Dark chocolate", ref_q: 8, name: "Maria", …}
					2: {id: 47, ref_as: 27, answer_text: "Milk chocolate", ref_q: 8, name: "Maria", …}
					3: {id: 48, ref_as: 27, answer_text: "White chocolate", ref_q: 8, name: "Maria", …}
					4: {id: 49, ref_as: 27, answer_text: "Chocolate", ref_q: 11, name: "Maria", …}
					5: {id: 50, ref_as: 27, answer_text: "I love the texture!", ref_q: 9, name: "Maria", …}
					length: 6
				28: (5) [{…}, {…}, {…}, {…}, {…}]}

			
			Object.entries () is used for listing all the [key,value] pairs of an object
			Object.entries(arr) = {
					0: (2) ["27", Array(6)]
					1: (2) ["28", Array(5)]
			}
			*/
			setAnswersSheet(Object.entries(arr));
		};

		setLoading(true);
		if (props.loggedIn) {
			getAnswerSheetsById(id).then(() => {
				setShow(true);
			});
		}
		getSurveyById(id).then(() => {
			setShow(true);
			setLoading(false);
		});
	};

	return (
		<ListGroup.Item className="container-fluid bg-light ">
			<Row>
				<Col lg={10} className="m-0 p-0">
					<h2>{props.item.title}</h2>

					<i>made by {props.item.adminName}</i>
					{props.loggedIn ? (
						<i>
							, compiled by: {props.surveyList[props.index].n_submissions}{" "}
							persons
						</i>
					) : (
						""
					)}
				</Col>
				<Col lg={2} className="m-0 p-0">
					<Button
						variant="outline-success"
						disabled={props.surveyList[props.index].n_submissions === 0}
						onClick={() => {
							handleSurvey(props.item.id);
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							fill="currentColor"
							className="bi bi-eye-fill"
							viewBox="0 0 16 16"
						>
							<path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
							<path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
						</svg>
					</Button>
				</Col>
			</Row>
			{props.survey ? (
				<ModalAnswerSheet
					show={show}
					setShow={setShow}
					item={props.item}
					survey={props.survey}
					setSurvey={props.setSurvey}
					loggedIn={props.loggedIn}
					answersSheet={answersSheet}
					setAnswersSheet={setAnswersSheet}
					loading={loading}
					setLoading={setLoading}
				></ModalAnswerSheet>
			) : (
				""
			)}
		</ListGroup.Item>
	);
}

export default SurveyRow;
