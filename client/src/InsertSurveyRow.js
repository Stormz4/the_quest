import { Col, Row, ListGroup, Button } from "react-bootstrap";
/*
	This component represents a question row renderer in the Insert Survey page.
	It contains the buttons used to move up, move down and delete a question.
*/

function InsertSurveyRow(props) {

	const moveUp = () => {
		let q = [...props.question];
		if (props.id === 0) {
			props.setErrorMessage("The element is at the top");
		} else {
			// Swap with the element before
			let tmp = q[props.id];
			q[props.id] = q[props.id - 1];
			q[props.id - 1] = tmp;
			props.setQuestion(q);
			props.setErrorMessage("");
		}
	};

	const moveDown = () => {
		let q = [...props.question];
		if (props.id + 1 === props.question.length) {
			props.setErrorMessage("The element is at the bottom");
		} else {
			let tmp = q[props.id];
			q[props.id] = q[props.id + 1];
			q[props.id + 1] = tmp;
			props.setQuestion(q);
			props.setErrorMessage("");
		}
	};

	const handleDelete = () => {
		let q = [...props.question];
		q.splice(props.id, 1);
		props.setQuestion(q);
	};

	function renderItem() {
		// Closed question
		if (props.item.open === 0) {
			return (
				<Row>
					<Col className="m-0 p-0">
						<h2>
							{props.id + 1}. Closed question: {props.item.question}{" "}
							<Col>
								<Button variant="danger" className="p-2" onClick={handleDelete}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="28"
										height="28"
										fill="currentColor"
										className="bi bi-trash align-items-center"
										viewBox="0 0 16 16"
									>
										<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
										<path
											fillRule="evenodd"
											d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
										/>
									</svg>
									Delete
								</Button>{" "}
								<Button className="p-2" variant="info" onClick={moveUp}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="28"
										height="28"
										fill="currentColor"
										className="bi bi-arrow-up"
										viewBox="0 0 16 16"
									>
										<path
											fillRule="evenodd"
											d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
										/>
									</svg>
									Move up
								</Button>{" "}
								<Button className="p-2" onClick={moveDown}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="28"
										height="28"
										fill="currentColor"
										className="bi bi-arrow-down"
										viewBox="0 0 16 16"
									>
										<path
											fillRule="evenodd"
											d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
										/>
									</svg>
									Move down
								</Button>
							</Col>
						</h2>
						<i>
							min: {props.item.min}, max: {props.item.max}
						</i>
						<br></br>
						Answers: <br></br>
						{props.item.answers.map((value, index) => (
							<i key={index}>
								{index + 1}. {value}
								<br></br>
							</i>
						))}
					</Col>
				</Row>
			);
		} else {
			// Open question
			return (
				<Row>
					<Col className="justify-content-center m-0 p-0">
						<h2>
							{props.id + 1}. Open question: {props.item.question}
							<Col>
								<Button variant="danger" className="p-2" onClick={handleDelete}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="28"
										height="28"
										fill="currentColor"
										className="bi bi-trash align-items-center"
										viewBox="0 0 16 16"
									>
										<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
										<path
											fillRule="evenodd"
											d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
										/>
									</svg>
									Delete
								</Button>{" "}
								<Button className="p-2" variant="info" onClick={moveUp}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="28"
										height="28"
										fill="currentColor"
										className="bi bi-arrow-up"
										viewBox="0 0 16 16"
									>
										<path
											fillRule="evenodd"
											d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
										/>
									</svg>
									Move up
								</Button>{" "}
								<Button className="p-2" onClick={moveDown}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="28"
										height="28"
										fill="currentColor"
										className="bi bi-arrow-down"
										viewBox="0 0 16 16"
									>
										<path
											fillRule="evenodd"
											d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
										/>
									</svg>
									Move down
								</Button>
							</Col>
						</h2>

						{props.item.required ? (
							<i>It is required.</i>
						) : (
							<i>It's not required.</i>
						)}
						<i> Max {props.item.max} chars for the answer.</i>
					</Col>
				</Row>
			);
		}
	}
	return (
		<ListGroup.Item className="container-fluid bg-light ">
			{renderItem()}
		</ListGroup.Item>
	);
}

export default InsertSurveyRow;
