import { Button, Form, Alert, Container, Row, ListGroup} from "react-bootstrap";
import { useState } from "react";
import API from "./API"
import ModalInsertSurvey from "./ModalInsertSurvey";
import InsertSurveyRow from "./InsertSurveyRow"
import {
	useHistory
} from "react-router-dom";

/*
	This component represents the page used to insert a survey.
	It contains the states regarding all the questions and makes use of modals in order to render the forms to insert a certain type of question,
	setting the state accordingly.
	Open -> type = 0, Closed = type = 1.
	It also checks if the title has been inserted and if there is at least 1 question in the survey.	
	This component also calls the API in order to insert a certain survey.
*/

function InsertSurvey(props) {
    const [show, setShow] = useState(false);
    // Type:1 -> closed, type:0 -> open
    const [type, setType] = useState(-1)
    const [question, setQuestion] = useState([])
	const [title, setTitle] = useState("")
	const [errorMessage, setErrorMessage] = useState("");
	const history = useHistory();

    function renderQuestions() {
		if ( question && question.length > 0) {
			return question.map((item, index) => (
				<InsertSurveyRow
					question={question}
					setQuestion={setQuestion}
					item={item}
					id={index}
					key={index}
					setErrorMessage={setErrorMessage}
				></InsertSurveyRow>
			));
		}

	}

	const addSurvey = async(titleToAdd, questionsToAdd) =>{


		API.addSurvey(titleToAdd, questionsToAdd)
		.then(() => {
				setShow(false);
				setType(-1);
				props.setDirty(true);
				setErrorMessage("")
				console.log("PROVA")
				history.push("/admin")
			})
			.catch(function (error) {
				console.log(error);
				alert("Si è verificato un errore, riprova.");
			});
	}
	const handleSubmit = (event) =>{
		event.preventDefault();
		if (title !== undefined && title!=="" && question.length > 0){
			addSurvey(title, question)
		}
		else{
			setErrorMessage("You must add at least a question and a title.")
		}

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
				{errorMessage ? (
									<Alert variant="danger">{errorMessage}</Alert>
								) : (
									""
								)}
				<Row className="justify-content-center p-1 align-items-center">
					<Form>
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
					</Form>
				</Row>
				<ListGroup variant="flush">{renderQuestions()}</ListGroup>
				<ModalInsertSurvey
					show={show}
					setShow={setShow}
					type={type}
					setType={setType}
					question={question}
					setQuestion={setQuestion}
					setErrorMessage={setErrorMessage}
				></ModalInsertSurvey>

				<hr></hr>
				<Button variant="primary" onClick={handleSubmit}>Submit survey</Button>
			</Container>
		);
}

export default InsertSurvey;