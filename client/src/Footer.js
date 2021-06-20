import { Row, Col, Container } from "react-bootstrap";

// Footer of the webapp

function Footer() {
	return (
		<Container fluid>
			<Row>
				<Col
					className="text-light text-center"
					style={{ backgroundColor: "seagreen" }}
				>
					&copy; Developed entirely by Mattia Lisciandrello, 2021.
				</Col>
			</Row>
		</Container>
	);
}

export default Footer;
