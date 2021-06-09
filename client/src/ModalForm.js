import { Button, Modal, Form, Col} from "react-bootstrap";
import { useState } from "react";
import { Formik} from "formik";
import API from "./API"


function ModalForm(props) {
    const [name, setName]=useState("");
	let user = props.user;	

	const handleClose=()=>{
		props.setShow(false);

		user={}

	}

	
	const handleSubmit = (event) => {
		event.preventDefault();


        handleClose();
		console.log("submit");
	};
		return (
			<>
				<Modal show={props.show} onHide={handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>
							Survey: {props.item.titolo}
						</Modal.Title>
					</Modal.Header>
					<Modal.Body style={{ textAlign: "center" }}>
						<Formik
							initialValues={{
								name: "",
							}}
						>
							{({ errors, touched, isValidating }) => (
								<Form
									onSubmit={(values) => {
											handleSubmit(values); // same shape as initial values
									}}
								>
									<Form.Group>
										<Form.Label>Insert your name </Form.Label>
										<Form.Control
											name="description"
											required
                                            value={name}
											placeholder="Walk around"
											type="text"
                                            required
											onChange={(ev) =>
												setName(ev.target.value)
											}
										/>
										{errors.description && touched.description && (
											<div>{errors.description}</div>
										)}
									</Form.Group>
									<Modal.Footer className="justify-content-center ">
										<Button variant="secondary" onClick={handleClose}>
											Close
										</Button>
										<Button variant="primary" type="onSubmit">
											Save Changes
										</Button>
									</Modal.Footer>
								</Form>
							)}
						</Formik>
					</Modal.Body>
				</Modal>
			</>
		);
}



export default ModalForm;