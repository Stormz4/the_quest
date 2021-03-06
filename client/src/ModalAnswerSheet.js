import { Button, Modal, Form, Alert } from "react-bootstrap";
import { useState } from "react";
import { Formik } from "formik";
import API from "./API";
import AnswerSheetRow from "./AnswerSheetRow";

/*
	This component represents the modal used to:
	- submit a survey , only for a non-logged user
	- view the submissions made for a certain survey, only for a logged admin 

	It contains also all the states regarding the answers and it receives, as a prop, the specific survey and all the answer sheets related to it.
	It also maintains an index in order to move forward and back between all the answers sheets.

*/

function ModalAnswerSheet(props) {
	const [name, setName] = useState("");
	const [answers, setAnswers] = useState([]);
	const [errorMessage, setErrorMessage] = useState("");
	const [indexSheet, setIndex] = useState(0);

	let surveyQuestions = props.survey;
	let survey = props.item;
	

	const handleClose = () => {
		props.setShow(false);
		
		setName("")
		setAnswers([])

		
		setIndex(0)
		setErrorMessage("")

	};

	const renderForm = (handleChange) => {

		if (surveyQuestions !== undefined && surveyQuestions.length > 0 ) {
			return surveyQuestions.map((item, index) => (
				<AnswerSheetRow
					loggedIn={props.loggedIn}
					handleChange={handleChange}
					item={item}
					key={index}
					index={index}
					answers={answers}
					setAnswers={setAnswers}
					answersSheet={props.answersSheet[indexSheet]}
				></AnswerSheetRow>
			));
		}
	};

	const evaluatePlaceholderName = () =>{

		if (props.answersSheet !== undefined && props.answersSheet.length > 0) {
			// AnswersSheet is made as:
			/*
			0: Array(2)
				0: "2"
				1: Array(4)
				0: {id: 1, ref_as: 2, answer_text: "Dark chocolate", ref_q: 7, name: "Mattia", …}
				1: {id: 2, ref_as: 2, answer_text: "Milk chocolate", ref_q: 7, name: "Mattia", …}
				2: {id: 3, ref_as: 2, answer_text: "I like chocolate a lot!", ref_q: 8, name: "Mattia", …}
				3: {id: 4, ref_as: 2, answer_text: "The taste is just amazing", ref_q: 9, name: "Mattia", …}
			1: Array(2)
			...
			Answers sheet are grouped by their answer sheet id, and then each elemenet contains an array of elements where the name is repeated
			*/
			return props.answersSheet[indexSheet][1][0].name;
		} else return "Insert your answer.";
	}
	const submitAnswers = async(answersInserted, surveyChoosen, userName) =>{
		API.submitAnswers(answersInserted, surveyChoosen, userName)
		.then(() => {
				handleClose();
			})
			.catch(function (error) {
				console.log(error);
				alert("Si è verificato un errore, riprova.");
			});
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		let errors=0;
		let counter=0;
		let errorName;
		if (surveyQuestions !== undefined || surveyQuestions.length > 0){

			for (const question of surveyQuestions){

				// For each question, get all the answers with the same id and verify the costraints
				for (const answer of answers){
					if (question.id === answer.id_question){
						if(answer.open === 0){
							counter++;
						}
					}
				}


				// If the number of checked answers is below the min or bigger than the max, return an error and set the message
				if (counter < question.min || counter > question.max){
					errors++;
					errorName = question.question;
					counter=0; 
					break;
				}
				counter=0; // Reset it for the next question
			}
		}

		if (errors === 0 ){
			submitAnswers(answers, survey, name);
		}
		else{
			setErrorMessage(
				`Every closed question must respect the relative costraints. Check question: "${errorName}"`
			);
		}
	};
	return (
		<>
			<Modal size="lg" show={props.show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Survey: {survey.title}</Modal.Title>
				</Modal.Header>
				<Modal.Body style={{ textAlign: "center" }}>
					<Formik
					>
						{({ handleChange,errors, touched }) => (
							<Form
								onSubmit={(ev) => {
									handleSubmit(ev);
								}}
							>
								
								<Form.Label>Insert your name.</Form.Label>
								<Form.Control
									name="name"
									readOnly={props.loggedIn ? true : false }
									required
									value={name}
									placeholder={evaluatePlaceholderName()}
									type="text"
									onChange={(ev) => setName(ev.target.value)}
								/>
								<hr></hr>
								{errorMessage ? (
									<Alert variant="danger">{errorMessage}</Alert>
								) : (
									""
								)}
								{props.loading ? (
											<>
												<br></br>
												<br></br>
												<br></br>
												<h3>🕗 Please wait, loading your surveys... 🕗</h3>
											</>
										) : renderForm(handleChange)}
								<Modal.Footer className="justify-content-center ">
									{props.loggedIn ? (
										<>
											<Button
												variant="info"
												disabled={indexSheet === 0}
												className="ml-0 p-2"
												onClick={() => {
													setIndex(indexSheet - 1);
												}}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="32"
													height="32"
													fill="currentColor"
													className="bi bi-arrow-bar-left"
													viewBox="0 0 16 16"
												>
													<path
														fillRule="evenodd"
														d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5zM10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5z"
													/>
												</svg>{" "}
												Go back
											</Button>

											<Button
												variant="info"
												className="ml-0 p-2"
												disabled={indexSheet === props.answersSheet.length-1}
												onClick={() => setIndex(indexSheet + 1)}
											>
												Go forward
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="32"
													height="32"
													fill="currentColor"
													className="bi bi-arrow-bar-right"
													viewBox="0 0 16 16"
												>
													<path
														fillRule="evenodd"
														d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8zm-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5z"
													/>
												</svg>
											</Button>
										</>
									) : (
										<>
											<Button variant="secondary" onClick={handleClose}>
												Close
											</Button>
											<Button variant="primary" type="onSubmit">
												Save Changes
											</Button>
										</>
									)}
								</Modal.Footer>
							</Form>
						)}
					</Formik>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default ModalAnswerSheet;
