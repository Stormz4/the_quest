import { useState } from "react";
import { Form, Col, Row, ListGroup, Button } from "react-bootstrap";
import ModalForm from "./ModalForm";
import API from "./API";

function InsertSurveyRow(props) {
	console.log(props);

	function renderItem() {
		if (props.item.min != null) {
			return (
				<Row>
					<Col className="m-0 p-0">
						<h2>
							{props.id + 1}. Closed question: {props.item.question}
						</h2>
						<h8>
							<i>
								min: {props.item.min}, max: {props.item.max}
							</i>
							<br></br>
							Answers:{" "} <br></br>
						</h8>

							{props.item.answers.map((value, index) => (
								<i>{index+1}. {value}<br></br></i>
							))}
					</Col>
				</Row>
			);
		} else {
			return (
				<Row>
					<Col className="m-0 p-0">
						<h2>
							{props.id+1}. Open question: {props.item.question}
						</h2>

						{props.item.required ? (
							<h8>
								<i>It is required.</i>
							</h8>
						) : (
							<h8>
								<i>It's not required.</i>
							</h8>
						)}
						<h8>
							<i> Max {props.item.max} chars for the answer.</i>
						</h8>
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