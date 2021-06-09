import { Button, Modal, Form, Col, Row, Alert } from "react-bootstrap";
import { useState } from "react";
import { Formik } from "formik";
import API from "./API";

function LoginModal(props) {
	const [emailNoCase, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const handleClose = () => {
		props.setShow(false);
	};

    const handleLogin = (event) => {
		event.preventDefault();
        setErrorMessage('');
        console.log("hello");

		let email = emailNoCase.toLowerCase();
        const credentials = {email, password};
        console.log(credentials)
        let valid = true;
        if(email === '' || password === '' || password.length < 6)
            valid = false;
        
        if(valid)
        {
          let success = props.login(credentials);
          if (success) handleClose();
        }
        else {
          setErrorMessage('Password should be at least 6 characters.');
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
					<Formik
						initialValues={{
							description: "",
						}}
					>
						{({ errors, touched, isValidating }) => (
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
										{errors.description && touched.description && (
											<div>{errors.description}</div>
										)}
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
										{errors.description && touched.description && (
											<div>{errors.description}</div>
										)}
									</Form.Group>
								</Row>
								<Row lg={3} className="m-3 justify-content-md-center">
									<Button variant="primary" type="onSubmit">
										Login
									</Button>
								</Row>
							</Form>
						)}
					</Formik>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default LoginModal;
