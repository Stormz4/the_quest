import { Button, Modal, Form, Col, Container, Row, ListGroup} from "react-bootstrap";
import { useState } from "react";
import { Formik} from "formik";
import API from "./API"
import ModalInsertSurvey from "./ModalInsertSurvey";
import InsertSurveyRow from "./InsertSurveyRow"
import QuestionaryRow from "./QuestionaryRow"

function InsertSurvey(props) {
    const [show, setShow] = useState(false);
    // Type:1 -> closed, type:0 -> open
    const [type, setType] = useState(-1)
    const [question, setQuestion] = useState([])
    console.log(question)

    function renderQuestions() {
		if ( question && question.length > 0) {
			return question.map((item) => (
				<InsertSurveyRow
					item={item}
					key={item.id}
				></InsertSurveyRow>
			));
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
				<ListGroup variant="flush">{renderQuestions()}</ListGroup>
				<ModalInsertSurvey
					show={show}
					setShow={setShow}
					type={type}
					setType={setType}
					question={question}
					setQuestion={setQuestion}
				></ModalInsertSurvey>
			</Container>
		);
}

export default InsertSurvey;