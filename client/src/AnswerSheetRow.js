import { Button, Modal, Form, Col } from "react-bootstrap";
import { useState } from "react";
import { Formik } from "formik";
import API from "./API";

function AnswerSheetRow(props) {
	console.log("PROPS:" ,props);
	let answers = [];
	let max = props.item.max;
	let min = props.item.min
    let open = props.item.open;
    let id = props.item.id;
	const [checksMade, setChecks] = useState(0)

	const handleCheck = (c, value) => {
		console.log("Checks made until now:" ,c, value)
		let res=true;
		if (value){
			// checked, must verify if we're below the max
			if (c<max){
				c++;
				setChecks(c);
				res = true;
			}
			else{
				alert("Max has been reached.");
				res=false;
			}
		}
		else{
			if (c<=min){
				alert("Min has been reached.");
				res = true;
			}
			else{
				c--;
				setChecks(c)
				res = false;
			}
		}
		
		console.log("Checks made after:", c)
		return res;
	}
    const renderOptions = (opt) =>{
        console.log(opt)
		console.log("AO", id)
        opt = opt.filter((item) => item != null);
        opt = opt.filter((item) => item.ref_q = id);
        console.log("OPT: ", opt)
		let merged = opt.reduce(function (prev, next) {
			return prev.concat(next);
		});
        console.log("FLATTENED: ",merged)
        return merged.map((item)=>(
            (
			<Form.Group min={min} max={2} >
				<Form.Check type="checkbox" label={item.option_text} onChange={(ev)=> {
					let r = handleCheck(checksMade, ev.target.checked)
					ev.target.checked=r;
				}}
				/>
				
			</Form.Group>
			)
		))

    };
	return (
		<>
			{open ? (
				<Form.Group>
					<Form.Label>{props.item.question}</Form.Label>
					<Form.Control
						name="answers"
						required
						value={answers}
						placeholder="Walk around"
						max={max}
						as="textarea"
						required={props.item.required}
						onChange={(ev) => (answers = ev.target.value)}
					/>
					<Form.Text className="text-muted">
						Max characters: {max}
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
