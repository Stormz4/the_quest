import { Container, Col, Row, ListGroup} from "react-bootstrap";
import SurveyRow from "./SurveyRow";

function SurveyContainer(props) {
    let surveyList = props.surveyList;


	function renderQuests() {
        
		if (surveyList && surveyList.length > 0) {
			return surveyList.map((item) => (
				<SurveyRow
					surveyList={surveyList}
					item={item}
					key={item.id}
					setDirty={props.setDirty}
					survey={props.survey}
					setSurvey={props.setSurvey}
				></SurveyRow>
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

export default SurveyContainer;
