import { Row, Col, Container } from "react-bootstrap";

function Footer() {
	return (
		<Container fluid>
			<Row>
				<Col
					className="text-light text-center"
					style={{ backgroundColor: "seagreen" }}
				>
					&copy; Developed entirely by Mattia Lisciandrello
				</Col>
			</Row>
		</Container>
	);
}

export default Footer;
