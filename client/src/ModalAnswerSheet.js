import { Button, Modal, Form, Col } from "react-bootstrap";
import { useState } from "react";
import { Formik, FieldArray } from "formik";
import API from "./API";
import AnswerSheetRow from "./AnswerSheetRow";

function ModalAnswerSheet(props) {
	const [name, setName] = useState("");
	let surveyQuestions = props.survey;
	let survey = props.item;
	const handleClose = () => {
		props.setShow(false);
	};

	const renderForm = () => {
		if (surveyQuestions != undefined) {
			return surveyQuestions.map((item, index) => (
				<AnswerSheetRow item={item} key={index}></AnswerSheetRow>
			));
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		handleClose();
		console.log("submit");
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
								<FieldArray name="answers" />
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
