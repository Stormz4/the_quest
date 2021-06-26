import { Button, Modal, Form, Row, Alert } from "react-bootstrap";
import { useState } from "react";

import { Redirect } from "react-router-dom";

/*
	This component represents the modal rendered in order to make a login. 
	It calls the login method present in App.js, which calls the API in order to set the session.
	It also contains validation of the credentials.
	toLowerCase() of the email is made in order to make the email not case-sensitive.
*/

function LoginModal(props) {
	const [emailNoCase, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const handleClose = () => {
		props.setShow(false);
	};

	const handleLogin = (event) => {
		event.preventDefault();
		setErrorMessage("");

		let email = emailNoCase.toLowerCase();
		const credentials = { email, password };
		let valid = true;
		if (email === "" || password === "" || password.length < 6) valid = false;

		if (valid) {
			let success = props.login(credentials);
			if (success) {
				handleClose();
				<Redirect to="admin"></Redirect>;
			}
		} else {
			setErrorMessage("Password should be at least 6 characters.");
		}
	};

	return (
		<>
			<Modal size="lg" show={props.show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Insert your administrator data.</Modal.Title>
				</Modal.Header>
				{errorMessage ? <Alert variant="danger">{errorMessage}</Alert> : ""}
				<Modal.Body style={{ textAlign: "center" }}>
					<Form
						onSubmit={(values) => {
							handleLogin(values);
						}}
					>
						<Row lg={1} className="p-3 justify-content-md-center">
							<Form.Group>
								<Form.Label>Insert your email</Form.Label>
								<Form.Control
									name="email"
									required
									value={emailNoCase}
									placeholder="sXXXXXX@studenti.polito.it"
									type="email"
									onChange={(ev) => setEmail(ev.target.value)}
								/>
							</Form.Group>
						</Row>
						<Row lg={1} className="p-3 justify-content-md-center">
							<Form.Group>
								<Form.Label>
									Insert your password: it should be at least 6 characters.
								</Form.Label>
								<Form.Control
									name="password"
									required
									value={password}
									placeholder="*********"
									type="password"
									onChange={(ev) => setPassword(ev.target.value)}
								/>
							</Form.Group>
						</Row>
						<Row lg={3} className="m-3 justify-content-md-center">
							<Button variant="primary" type="onSubmit">
								Login
							</Button>
						</Row>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default LoginModal;
