import { Button, Modal, Form, Col } from "react-bootstrap";
import { useState } from "react";
import { Formik } from "formik";
import API from "./API";

function AnswerSheetRow(props) {
	console.log(props);
	let answers = [];

    let open = props.item.open;
    let id = props.item.id;
    const renderOptions = (opt) =>{

        console.log(opt)
        opt = opt.filter((item) => item != null);
        opt = opt.filter((item) => item.ref_q = id);
        console.log("OPT: ", opt)
		let merged = opt.reduce(function (prev, next) {
			return prev.concat(next);
		});
        console.log("FLATTENED: ",merged)
        return merged.map((item)=>(
            (<h1>Yes</h1>)
        ))
    };
	return (
		<>
			{open ? (
				<Form.Group>
					<Form.Label>{props.item.question}</Form.Label>
					<Form.Control
						name="description"
						required
						value={answers}
						placeholder="Walk around"
						max={props.item.max}
						as="textarea"
						required={props.item.required}
						onChange={(ev) => (answers = ev.target.value)}
					/>
					<Form.Text className="text-muted">
						Max characters: {props.item.max}
					</Form.Text>
				</Form.Group>
			) : (
				<Form.Group>
					<Form.Label>{props.item.question}</Form.Label>
					{renderOptions(props.item.options)}
					<Form.Text className="text-muted">
						min/max options to choose: {props.item.min}/{props.item.max}
					</Form.Text>
				</Form.Group>
			)}
		</>
	);
}

export default AnswerSheetRow;
