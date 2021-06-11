import { useState } from "react";
import { Form, Col, Row, ListGroup, Button } from "react-bootstrap";
import ModalForm from "./ModalForm";
import API from "./API";

function QuestionaryRow(props) {
    const [show, setShow] = useState(false);
	console.log(props)

	const handleSurvey = async (id) =>{
		const getSurveyById = async(id) => {
			const survey = await API.getSurveyById(id);
			props.setSurvey(survey);
		}

		getSurveyById(id).then(()=>{
			setShow(true);
			console.log(props.survey)
		})
	}

	return (
		<ListGroup.Item className="container-fluid bg-light ">
			<Row>
				<Col lg={10} className="m-0 p-0">
					<h2>{props.item.title}</h2>
					<h8><i>made by {props.item.adminName}</i></h8>
				</Col>
				<Col lg={2} className="m-0 p-0">
					<Button
						variant="outline-success"
						onClick={() => {
							handleSurvey(props.item.id); 
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							fill="currentColor"
							class="bi bi-eye-fill"
							viewBox="0 0 16 16"
						>
							<path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
							<path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
						</svg>
					</Button>
				</Col>
			</Row>
			<ModalForm show={show} setShow={setShow} item={props.item} survey={props.survey}></ModalForm>
		</ListGroup.Item>
	);
}

export default QuestionaryRow;
