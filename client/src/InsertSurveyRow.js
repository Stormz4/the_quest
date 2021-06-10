import { useState } from "react";
import { Form, Col, Row, ListGroup, Button } from "react-bootstrap";
import ModalForm from "./ModalForm";
import API from "./API";

function InsertSurveyRow(props) {
    console.log(props)

    function renderItem(){
        if (props.item.min!=null ){
            return (<Row>
				<Col className="m-0 p-0">
					<h2>Closed question: {props.item.question}</h2>
                    <h5><i>min: {props.item.min}, max: {props.item.max}</i></h5>
				</Col>
			</Row>)
        }
        else{
            return (
							<Row>
								<Col className="m-0 p-0">
									<h2>Open question: {props.item.question}</h2>

                                    {props.item.required ? (<h5><i>It is required.</i></h5>) :(<h5><i>It's not required.</i></h5>) }
                                    <h5><i>Max {props.item.max} chars for the answer.</i></h5>

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
