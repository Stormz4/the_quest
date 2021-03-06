import { Form } from "react-bootstrap";

/*
	This component contains all the methods to:
	- Handle the state in order to register every answer made
	- Show the answers made to the author of the survey.

*/

function AnswerSheetRow(props) {
	let max = props.item.max;
	let open = props.item.open;
	let id = props.item.id;

	// This method checks if an answer present in the answer sheet contain the same option id (ref_option) of the item rendered.
	const evaluateCheck = (item) => {
		if (props.answersSheet !== undefined) {
			for (const answer of props.answersSheet[1]) {
				if (answer.ref_op === item.id_option) return true;
			}
			return false;
		}
	};

	// This method checks if an answer present in the answer sheet contain the same id (ref_question) of the item rendered.
	const evaluatePlaceholder = () => {
		if (props.loggedIn && props.answersSheet !== undefined) {
			for (const answer of props.answersSheet[1]) {
				if (answer.ref_q === id) {
					return answer.answer_text;
				}
			}
			return ""
		}
		else{
			for (let answer of props.answers){
				if (answer.index === props.index)
					return answer.answer
			}
			return "";
		}
	};

	// This method is used to render all the options in the case of a closed answer.

	const renderOptions = (opt) => {
		// I will filter the array, removing all the null options and maintaining only the options that have the same ref_q as the question rendered		// In this way, i will render every option for a given question
		opt = opt.filter((item) => item != null);
		opt = opt.filter((item) => item.id === id);

		// After processing the array, render all the options present for the current question

		return opt.map((item, index) => (
			<Form.Group key={index}>
				<Form.Check
					type="checkbox"
					readOnly={props.loggedIn ? true : false}
					checked={props.loggedIn && evaluateCheck(item)}
					label={item.option_text}
					onChange={(ev) => {
						if (ev.target.checked === true) {
							// If a check has been made, add the option
							let arr = [
								...props.answers,
								{
									id_question: id,
									ref_op: item.id_option,
									answer: item.option_text,
									open: 0,
								},
							];

							props.setAnswers(arr);
						} else {
							// If a check has been removed, remove the option by iterating all the
							// answers made and removing the one with the same id_option
							let arr = [...props.answers];

							for (let i = 0; i < arr.length; i++) {
								if (arr[i].ref_op === item.id_option) {
									arr.splice(i, 1);
									break;
								}
							}

							props.setAnswers(arr);
						}
					}}
				/>
			</Form.Group>
		));
	};

	return (
		<>
			{open ? ( // OPEN QUESTION
				<Form.Group>
					<Form.Label>
						<h6>
							<i>{props.item.question}</i>
						</h6>
					</Form.Label>
					<Form.Control
						as="textarea"
						name="answers"
						readOnly={props.loggedIn ? true : false}
						value={evaluatePlaceholder()}
						type="text"
						maxLength={props.item.max}
						required={props.item.required}
						onChange={(ev) => {
							let arr = [
								...props.answers,
								{ id_question: id, answer: ev.target.value, open: 1, index: props.index},
							];

							for (let i = 0; i < arr.length - 1; i++) {
								// Verifify if there is another answer with the same ID
								// When the state is an array and you write a char in a form, a new element will be pushed.
								// If i have my string "ab" and i write b, "abc" will be pushed.
								// For this reason, i remove all the other answers with the same question id.
								if (arr[i].id_question === id) {
									//splice(start, deleteCount)
									arr.splice(i, 1);
									break;
								}
							}
							props.setAnswers(arr);
						}}
					/>
					<Form.Text className="text-muted">
						Max characters: {max}.{" "}
						{props.item.required ? <i>This question is required.</i> : ""}
					</Form.Text>
				</Form.Group>
			) : (
				// CLOSED QUESTION
				<Form.Group>
					<Form.Label>
						<h6>
							<i>{props.item.question}</i>
						</h6>
					</Form.Label>
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
