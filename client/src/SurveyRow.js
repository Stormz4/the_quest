import { useState } from "react";
import { Form, Col, Row, ListGroup, Button } from "react-bootstrap";
import ModalAnswerSheet from "./ModalAnswerSheet";
import API from "./API";

function SurveyRow(props) {
	const [show, setShow] = useState(false);
	const [answersSheet, setAnswersSheet] = useState([])

	console.log("SURVEY: ", props.surveyList)
	const handleSurvey = async (id) => {
		const getSurveyById = async (id) => {
			const survey = await API.getSurveyById(id);
	
			// If a question is open, it will be present multiple times.
			// I remove in this case all the rows that contain a duplicated id
			// filter((element, index, array) => { ... } )
			let s2 = survey.filter(
				(element, index, array) => array.findIndex((t) => t.id === element.id) === index
			);
			props.setSurvey(s2);
		};

		const getAnswerSheetsById = async (id) => {
			const answersSheet = await API.getAnswerSheetsById(id);

			// reduce((accumulator, currentValue) => { ... } )
			let arr = answersSheet.reduce((acc, currVal) => {
				acc[currVal.ref_as] = [...(acc[currVal.ref_as] || []), currVal];
				return acc;
			}, {});
			// group the array by differents values of ref_answer sheet

			setAnswersSheet(Object.entries(arr))

		};

		if (props.loggedIn){
			getAnswerSheetsById(id).then(()=> {
				setShow(true);
			});
		}
			getSurveyById(id).then(() => {
				setShow(true);
			});
		
	};

	return (
		<ListGroup.Item className="container-fluid bg-light ">
			<Row>
				<Col lg={10} className="m-0 p-0">
					<h2>{props.item.title}</h2>
					<h8>
						<i>made by {props.item.adminName}</i>
						{props.loggedIn ? (
							<i>
								, compiled by: {props.surveyList[props.index].n_submissions}{" "}
								persons
							</i>
						) : (
							""
						)}
					</h8>
				</Col>
				<Col lg={2} className="m-0 p-0">
					<Button
						variant="outline-success"
						disabled={props.surveyList[props.index].n_submissions==0}
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
			{props.survey ? (
				<ModalAnswerSheet
					show={show}
					setShow={setShow}
					item={props.item}
					survey={props.survey}
					setSurvey={props.setSurvey}
					loggedIn={props.loggedIn}
					answersSheet={answersSheet}
					setAnswersSheet={setAnswersSheet}
				></ModalAnswerSheet>
			) : (
				""
			)}
		</ListGroup.Item>
	);
}

export default SurveyRow;
