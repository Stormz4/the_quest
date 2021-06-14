import { Button, Modal, Form, Alert } from "react-bootstrap";
import { useState } from "react";
import { Formik, FieldArray } from "formik";
import API from "./API";
import AnswerSheetRow from "./AnswerSheetRow";

function ModalAnswerSheet(props) {
	const [name, setName] = useState("");
	const [answers, setAnswers] = useState([]);
	const [errorMessage, setErrorMessage] = useState("");

	let surveyQuestions = props.survey;
	let survey = props.item;
	console.log("SURVEY:" ,survey)
	// This will be used to count all the checkboxes that don't respect the minimun number

	const handleClose = () => {
		props.setShow(false);
		setName("")
		setAnswers([])
		setErrorMessage("")
	};

	const renderForm = (values, handleChange) => {
		if (surveyQuestions != undefined) {
			return surveyQuestions.map((item, index) => (
				<AnswerSheetRow 
				handleChange={handleChange} item={item} key={index} index={index} 
				answers={answers} setAnswers={setAnswers}></AnswerSheetRow>
			));
		}
	};

	const submitAnswers = async(ans, s) =>{


		let res = API.submitAnswers(ans, s)
		.then(() => {
				console.log(res)
				handleClose();
			})
			.catch(function (error) {
				console.log(error);
				alert("Si è verificato un errore, riprova.");
			});
	}

	const handleSubmit = (event, values) => {
		event.preventDefault();
		let errors=0;
		let counter=0;
		let errorName;
		for (const question of surveyQuestions){
			// For each question, get all the answers with the same id and verify the costraints
			for (const answer of answers){
				if (question.id === answer.id_question){
					if(answer.open === 0){
						counter++;
					}
				}
			}
			if (counter < question.min || counter > question.max){
				errors++;
				errorName = question.question;
				break;
			}
			counter=0; // Reset it for the next question
		}

		if (errors ==0 ){
			submitAnswers(answers, survey);
			console.log("ANSWERS: ",answers)
		}
		else{
			setErrorMessage(
				`Every closed question must respect the relative costraints. Check question: "${errorName}"`
			);
		}
	};
	return (
		<>
			<Modal show={props.show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Survey: {survey.title}</Modal.Title>
				</Modal.Header>
				<Modal.Body style={{ textAlign: "center" }}>
					<Formik
						initialValues={{
							answers: Array(surveyQuestions.length).fill(""),
						}}
					>
						{({ handleChange, values, errors, touched }) => (
							<Form
								onSubmit={(ev) => {
									handleSubmit(ev, values.answers);
								}}
							>
								<Form.Label>Insert your name.</Form.Label>
								<Form.Control
									name="name"
									required
									value={name}
									placeholder="Mattia"
									type="text"
									onChange={(ev) => setName(ev.target.value)}
								/>
								<hr></hr>
								{errorMessage ? (
									<Alert variant="danger">{errorMessage}</Alert>
								) : (
									""
								)}
								{renderForm(values, handleChange)}
								<Modal.Footer className="justify-content-center ">
									<Button variant="secondary" onClick={handleClose}>
										Close
									</Button>
									<Button variant="primary" type="onSubmit">
										Save Changes
									</Button>
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
