import { Container, Col, Row, ListGroup} from "react-bootstrap";
import QuestionaryRow from "./QuestionaryRow";

function QuestionaryContainer(props) {
    let surveyList = props.surveyList;


	function renderQuests() {
        
		if (surveyList && surveyList.length > 0) {
			return surveyList.map((item) => (
				<QuestionaryRow
					surveyList={surveyList}
					item={item}
					key={item.id}
					setDirty={props.setDirty}

				></QuestionaryRow>
			));
        }

	}
	return (
		<Container
			fluid
			className="flex-grow-1 bg-light d-flex justify-content-center p-0 m-0"
			style={{ margin: 0, paddingLeft: 0}}
		>
			<Col lg={5} className="p-0 m-0">
				<ListGroup variant="flush">{renderQuests()}</ListGroup>
			</Col>
		</Container>
	);
}

export default QuestionaryContainer;