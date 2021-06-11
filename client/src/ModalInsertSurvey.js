import { Button, Modal, Form, Col, Alert } from "react-bootstrap";
import { useState } from "react";
import { Formik } from "formik";
import API from "./API";
import QuestionaryRow from "./QuestionaryRow"

function ModalInsertSurvey(props) {
	const [question, setQuestion] = useState();

	// Closed question
	const [min, setMin] = useState(0);
	const [max, setMax] = useState(0);
	const [answers, setAnswers] = useState([]);
	const [genAnswers, setGenAnswers] = useState([])
	const [maxChar, setMaxChar] = useState(0);
	const [errorMessage, setErrorMessage] = useState("");
	const [showAnswer, setShowAnswer] = useState(false)

	// Closed
	const [required, setRequired] = useState(false);


	function generateAnswer(){

		console.log(showAnswer)
		let arr = [];
		if (max>0){
			for (let i=0; i<max; i++){
				arr.push("")
			}
			console.log(arr)
			setAnswers(arr);

		}
		setShowAnswer(false);
		
        

    };

	const handleClose = () => {
		setQuestion("")
		setMin(0)
		setMax(0)
		setMaxChar(0)
		setShowAnswer(false)
		setAnswers([]);
		setGenAnswers([]);
		props.setShow(false);
		
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		if (min <= max) {
			let questionComplete;
			if (props.type == 1) {
				questionComplete = {
					question: question,
					min: min,
					max: max,
					answers: genAnswers,
					open: 0,
					required: null,
				};
			} else {
				questionComplete = {
					question: question,
					required: +required,
					max: maxChar,
					min: null,
					open: 1,
					answers: null,
				};
			}

			let newQuestion = [...props.question, questionComplete];

			props.setQuestion(newQuestion);
			console.log(questionComplete);
			console.log("Min:", min, "| Max: ", max, "| Question: ", question);
			handleClose();
		} else {
			setErrorMessage("Min must be below or equal to max.");
		}
		console.log("submit");
	};

	return (
		<>
			<Modal show={props.show} onHide={handleClose}>
				<Modal.Header closeButton>
					{props.type ? (
						<Modal.Title>Insert a closed question</Modal.Title>
					) : (
						<Modal.Title>Insert an open question</Modal.Title>
					)}
				</Modal.Header>
				{errorMessage ? <Alert variant="danger">{errorMessage}</Alert> : ""}
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
								<Form.Group>
									<Form.Label>Insert the question </Form.Label>
									<Form.Control
										name="question"
										required
										value={question}
										placeholder="Which is the best chocolate?"
										type="string"
										onChange={(ev) => {
											setQuestion(ev.target.value);
											console.log(question);
										}}
									/>
									{errors.description && touched.description && (
										<div>{errors.description}</div>
									)}
								</Form.Group>
								{props.type ? (
									<>
										<Form.Group>
											<Form.Label>
												Insert the minimum number of answers.{" "}
											</Form.Label>
											<Form.Control
												as="select"
												required
												onChange={(ev) => setMin(ev.target.value)}
											>
												<option value="0">0</option>
												<option value="1">1</option>
												<option value="2">2</option>
												<option value="3">3</option>
												<option value="4">4</option>
												<option value="5">5</option>
												<option value="6">6</option>
												<option value="7">7</option>
												<option value="8">8</option>
												<option value="9">9</option>
												<option value="10">10</option>
											</Form.Control>
										</Form.Group>
										<Form.Group>
											<Form.Label>Insert the maximum of answers. </Form.Label>
											<Form.Control
												as="select"
												required
												onChange={(ev) => {
													setMax(ev.target.value);
													setShowAnswer(true);
												}}
											>
												<option value="0">0</option>
												<option value="1">1</option>
												<option value="2">2</option>
												<option value="3">3</option>
												<option value="4">4</option>
												<option value="5">5</option>
												<option value="6">6</option>
												<option value="7">7</option>
												<option value="8">8</option>
												<option value="9">9</option>
												<option value="10">10</option>
											</Form.Control>
										</Form.Group>
									</>
								) : (
									<>
										<Form.Group>
											<Form.Label>Is it a required question? </Form.Label>
											<br></br>
											<Form.Check
												inline="true"
												label="Yes, it's required"
												name="required"
												type="checkbox"
												value={required}
												onChange={(ev) => setRequired(ev.target.checked)}
											/>{" "}
										</Form.Group>
										<Form.Group>
											<Form.Label>
												How many chars maximum in the answer?{" "}
											</Form.Label>
											<br></br>
											<Form.Control
												name="maxChar"
												type="number"
												min={1}
												max={200}
												value={maxChar}
												onChange={(ev) => setMaxChar(ev.target.value)}
											/>{" "}
										</Form.Group>
									</>
								)}
								{showAnswer
									? generateAnswer()
									: answers.map((item, index) => (
											<Form.Group>
												<Form.Label>Insert the answer </Form.Label>
												<Form.Control
													name="answer"
													required
													placeholder="Insert your answer"
													type="string"
													onChange={(ev) =>
														setGenAnswers([
															...genAnswers.slice(0, index),
															ev.target.value,
														])
													}
												/>
											</Form.Group>
									  ))}
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

export default ModalInsertSurvey;
