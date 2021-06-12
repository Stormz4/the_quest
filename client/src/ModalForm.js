import { Button, Modal, Form, Col } from "react-bootstrap";
import { useState } from "react";
import { Formik } from "formik";
import API from "./API";
import AnswerSheetRow from "./AnswerSheetRow";

function ModalForm(props) {
	const [name, setName] = useState("");
	let surveyQuestions = props.survey;
	let survey = props.item;
	console.log(survey);
	let i = 0;
	let answers = [];
	const handleClose = () => {
		props.setShow(false);
		survey = {};
		answers = [];
		i = 0;
	};

	const renderForm = () => {
		if (surveyQuestions != undefined) {
			i++;
			return surveyQuestions.map((item) => (
				<AnswerSheetRow item={item}></AnswerSheetRow>
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
							name: "",
						}}
					>
						{({ errors, touched, isValidating }) => (
							<Form
								onSubmit={(values) => {
									handleSubmit(values); // same shape as initial values
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

export default ModalForm;
