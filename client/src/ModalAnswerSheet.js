import { Button, Modal, Form, Col } from "react-bootstrap";
import { useState } from "react";
import { Formik, FieldArray } from "formik";
import API from "./API";
import AnswerSheetRow from "./AnswerSheetRow";

function ModalAnswerSheet(props) {
	const [name, setName] = useState("");
	let surveyQuestions = props.survey;
	let survey = props.item;

	console.log("SURVEY QUESTIONS: ", surveyQuestions);
	// This will be used to count all the checkboxes that don't respect the minimun number
	const [belowMin, setBelowMin] = useState(0);

	const handleClose = () => {
		props.setShow(false);
	};

	const renderForm = () => {
		if (surveyQuestions != undefined) {
			return surveyQuestions.map((item, index) => (
				<AnswerSheetRow item={item} key={index} setBelowMin={setBelowMin}></AnswerSheetRow>
			));
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (belowMin == 0)
			handleClose();
		else{
			alert("You have to respect the minimum limit in open questions.")
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
							answers: [""],
						}}
					>
						{({ errors, touched }) => (
							<Form
								onSubmit={() => {
									handleSubmit(); // same shape as initial values
								}}
							>
								{renderForm()}
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
