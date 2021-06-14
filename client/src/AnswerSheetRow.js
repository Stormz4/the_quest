import {Form} from "react-bootstrap";
import { useState } from "react";

function AnswerSheetRow(props) {
	let max = props.item.max;
	let min = props.item.min
    let open = props.item.open;
    let id = props.item.id;
	let index = props.index;
	if (props.answersSheet != undefined){

	}

	const evaluateCheck =(item) =>{
		if (props.answersSheet != undefined){
			for(const answer of props.answersSheet[1]){
				if (answer.answer_text === item.option_text)
					return true;
				}
		return false;
		}
	}

	const evaluatePlaceholder = () =>{
		if (props.answersSheet != undefined){
			for(const answer of props.answersSheet[1]){
				if (answer.ref_q === id){
					return answer.answer_text;
				}
			}
		}
		else return "Insert your answer."
	}

    const renderOptions = (opt) =>{

		// I will filter the array, removing all the null options and maintaining only the options that have the same ref_q as the questions
		// In this way, i will render every option for a given question
        opt = opt.filter((item) => item != null);
        opt = opt.filter((item) => item.ref_q == id);

        return opt.map((item)=>(
            (
			<Form.Group >
				<Form.Check type="checkbox" value={props.answers} 
					readOnly={props.loggedIn}
					checked={evaluateCheck(item)}
					label={item.option_text} onChange={(ev)=> {
						if (ev.target.checked == true){
							// Add the option
							let arr = [
								...props.answers,
								{ id_question: id, answer: item.option_text, open: 0 },
								];
							props.setAnswers(arr);
						}
						else{
							// Remove the option
							let arr = [...props.answers]
							
							for (let i=0; i<arr.length; i++){
								if (arr[i].answer === item.option_text){
									arr.splice(i,1);
									break;
								}
							}
							props.setAnswers(arr);
						}
					}
				}

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
						readOnly={props.loggedIn}
						placeholder={evaluatePlaceholder()}
						type="text"
						maxLength={props.item.max}
						required={props.item.required}
						onChange={(ev) => {
							let arr = [
								...props.answers,
								{ id_question: id, answer: ev.target.value, open: 1 },
							];
							for (let i = 0; i < arr.length - 1; i++) {
								// Verifify if there is another answer with the same ID
								if (arr[i].id_question === id) {
									arr.splice(i, 1);
									break;
								}
							}
							props.setAnswers(arr);
						}}
					/>
					<Form.Text className="text-muted">Max characters: {max}. {props.item.required ? (<i>This question is required.</i>) : ("")}</Form.Text>
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
