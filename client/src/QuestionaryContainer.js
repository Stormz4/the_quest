import { Container, Col, Row, ListGroup} from "react-bootstrap";
import QuestionaryRow from "./QuestionaryRow";

function QuestionaryContainer(props) {
    let quests = [{"id":0, "titolo":"Interstellar"}, {"id":1, "titolo":"Rock Bottom"}];

                 
    console.log(quests)
	function renderQuests() {
        
		if (quests && quests.length > 0) {
			return quests.map((item) => (
				<QuestionaryRow
					quest={quests}
					item={item}
					key={item.id}
					setDirty={props.setDirty}
					user={props.user}
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
