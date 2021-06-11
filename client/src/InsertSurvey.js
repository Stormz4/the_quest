import { Button, Modal, Form, Col, Container, Row, ListGroup} from "react-bootstrap";
import { useState } from "react";
import { Formik} from "formik";
import API from "./API"
import ModalInsertSurvey from "./ModalInsertSurvey";
import InsertSurveyRow from "./InsertSurveyRow"
import QuestionaryRow from "./QuestionaryRow"
import {
	Redirect
} from "react-router-dom";

function InsertSurvey(props) {
    const [show, setShow] = useState(false);
    // Type:1 -> closed, type:0 -> open
    const [type, setType] = useState(-1)
    const [question, setQuestion] = useState([])
	const [title, setTitle] = useState("")

    function renderQuestions() {
		if ( question && question.length > 0) {
			return question.map((item, index) => (
				<InsertSurveyRow
					question={question}
					setQuestion={setQuestion}
					item={item}
					id={index}
				></InsertSurveyRow>
			));
		}

	}

	const addSurvey = async(titleToAdd, questionsToAdd) =>{

		API.addSurvey(titleToAdd, questionsToAdd)
			.then(() => {
				setShow(false);
				setType(-1);
				setQuestion([]);
				setTitle("");
				<Redirect to="/" />
			})
			.catch(function (error) {
				console.log(error);
				alert("Si è verificato un errore, riprova.");
			});
	}
	const handleSubmit = (event) =>{
		event.preventDefault();
		addSurvey(title, question)


	}

    return (
			<Container
				fluid
				className="p-0 m-0 justify-content-center"
				style={{ paddingLeft: 0 }}
			>
				<Row
					inline="true"
					className="justify-content-center p-1 align-items-center"
				>
					<Button
						variant="success"
						className="m-1"
						onClick={() => {
							setShow(true);
							setType(0);
						}}
					>
						Insert an open question
					</Button>
					<Button
						variant="success"
						className="m-1"
						onClick={() => {
							setShow(true);
							setType(1);
						}}
					>
						Insert a closed question
					</Button>
				</Row>
				<Row className="justify-content-center p-1 align-items-center">
					<Form.Group>
						<Form.Label>Insert the title of your survey.</Form.Label>
						<Form.Control
							name="title"
							required
							value={title}
							size="lg"
							placeholder={title}
							type="string"
							onChange={(ev) => setTitle(ev.target.value)}
						/>
					</Form.Group>
				</Row>
				<ListGroup variant="flush">{renderQuestions()}</ListGroup>
				<ModalInsertSurvey
					show={show}
					setShow={setShow}
					type={type}
					setType={setType}
					question={question}
					setQuestion={setQuestion}
				></ModalInsertSurvey>

				<hr></hr>
				<Button variant="primary" onClick={handleSubmit}>Submit survey</Button>
			</Container>
		);
}

export default InsertSurvey;