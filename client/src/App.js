import logo from './logo.svg';
import './App.css';
import { Container, Col, Row } from "react-bootstrap";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import NavigationBar from "./NavigationBar.js";
import Footer from "./Footer";
import QuestionaryContainer from "./QuestionaryContainer";
import { useState, useEffect } from "react";
import API from "./API"

function App() {
	const [surveyList, setSurveyList] = useState([]); 
	const [user, setUser] = useState({});
	const [dirty, setDirty] = useState(true);
	const [loggedIn, setLoggedIn] = useState(false);

	const login = async (credentials) => {
		try {
			
			const userInfo = await API.login(credentials);
			//if (filter === 0) { };
			setLoggedIn(true);
			setDirty(true);
			console.log(userInfo);
			alert("Welcome!")
			return true; 
		} catch (err) {
			alert(err);
			return false;
		}
	};

    useEffect(() => {
				//useEffect è un hook che permette di usare i lyfecycle del component. Equivale alla componentDidMount, componentDidUpdate, componentWillUnmount.

				const getAllSurveys = async () => {
					const surveys = await API.getAllSurveys();
					setSurveyList(surveys);
				};

					// console.log    da vedere, fa due richieste, magari dividere la funzione in 2

					getAllSurveys().then(() => {
						setDirty(false);
					});

		}, [dirty, user, loggedIn]);

    return (
			<Router>
				<Switch>
					<Route
						path="/"
						render={({ match }) => (
							<>
								<NavigationBar login={login} ></NavigationBar>
								<Container
									fluid
									className="min-vh-100 App bg-light"
									style={{ marginLeft: 0, marginRight: 0, padding: 0 }}
								>
									<Row
										className="justify-content-center text-light"
										style={{ backgroundColor: "seagreen" }}
									>
										{" "}
										<h2>
											Welcome to TheQuest. Enjoy our surveys!{" "}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="32"
												height="32"
												fill="currentColor"
												class="bi bi-list-nested"
												viewBox="0 0 16 16"
											>
												<path
													fill-rule="evenodd"
													d="M4.5 11.5A.5.5 0 0 1 5 11h10a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm-2-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm-2-4A.5.5 0 0 1 1 3h10a.5.5 0 0 1 0 1H1a.5.5 0 0 1-.5-.5z"
												/>
											</svg>
										</h2>
									</Row>
									<QuestionaryContainer></QuestionaryContainer>
								</Container>
								<Footer></Footer>
							</>
						)}
					></Route>
				</Switch>
			</Router>
		);
}

export default App;
