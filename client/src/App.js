import logo from './logo.svg';
import './App.css';
import { Container, Col, Button, Row} from "react-bootstrap";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
	Link
} from 'react-router-dom';
import NavigationBar from "./NavigationBar.js";
import Footer from "./Footer";
import SurveyContainer from "./SurveyContainer";
import { useState, useEffect } from "react";
import API from "./API"
import InsertSurvey from "./InsertSurvey"

function App() {
	const [surveyList, setSurveyList] = useState([]); 
	const [survey, setSurvey] = useState({})
	const [dirty, setDirty] = useState(true);
	const [loggedIn, setLoggedIn] = useState(false);

	const login = async (credentials) => {
		try {
			
			const userInfo = await API.login(credentials);
			//if (filter === 0) { };
			setLoggedIn(true);
			setDirty(true);
			console.log(userInfo);
			alert(`Welcome, ${userInfo.name}!`);
			return true; 
		} catch (err) {
			alert(err);
			return false;
		}
	};

	const logout = async () => {
		await API.logout();
		setLoggedIn(false);
		setSurveyList([]);
	};

	useEffect(() => {
		const checkAuth = async () => {
			try {
				// here you have the user info, if already logged in
				// TODO: store them somewhere and use them, if needed
				let user = await API.getAdminInfo();
				setLoggedIn(true);
			} catch (err) {
				console.error(err.error);
			}
		};
		checkAuth();
	}, []);


    useEffect(() => {
				//useEffect è un hook che permette di usare i lyfecycle del component. Equivale alla componentDidMount, componentDidUpdate, componentWillUnmount.
			const getAllSurveys = async () => {
				const surveys = await API.getAllSurveys();
				setSurveyList(surveys);
			};

			const getAllSurveysById = async () => {
				const surveys = await API.getAllSurveysById();
				setSurveyList(surveys);
			}

			if (!loggedIn){
				getAllSurveys().then(() => {
					setDirty(false);
				});
			}

			else{
				getAllSurveysById().then(() => {
					setDirty(false);
				});
			}

		}, [dirty, loggedIn]);

    return (
			<Router>
				<Switch>
					<Route
						path="/admin"
						render={() =>
							loggedIn ? (
								<>
									<NavigationBar
										logout={logout}
										loggedIn={loggedIn}
									></NavigationBar>{" "}
									<Row
										className="justify-content-center text-light"
										style={{ backgroundColor: "seagreen" }}
									>
										{" "}
									</Row>
									<SurveyContainer surveyList={surveyList}></SurveyContainer>
								</>
							) : (
								<Redirect to="/" />
							)
						}
					></Route>
					<Route
						path="/insert"
						render={() =>
							loggedIn ? (
								<>
									<NavigationBar
										logout={logout}
										loggedIn={loggedIn}
									></NavigationBar>{" "}
									<Container
										fluid
										className="min-vh-100 App bg-light"
										style={{ marginLeft: 0, marginRight: 0, padding: 0 }}
									>
										<Row
											className="justify-content-center text-light md-0"
											style={{ backgroundColor: "seagreen" }}
										>
											{" "}
											<h2>Customize your survey!</h2>
										</Row>
										<Row
											className="justify-content-center text-light md-0"
											style={{ backgroundColor: "seagreen" }}
										>
											<Link to="admin">
												<Button variant="light" className="p-1 m-1">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="32"
														height="32"
														fill="currentColor"
														class="bi bi-backspace"
														viewBox="0 0 16 16"
													>
														<path d="M5.83 5.146a.5.5 0 0 0 0 .708L7.975 8l-2.147 2.146a.5.5 0 0 0 .707.708l2.147-2.147 2.146 2.147a.5.5 0 0 0 .707-.708L9.39 8l2.146-2.146a.5.5 0 0 0-.707-.708L8.683 7.293 6.536 5.146a.5.5 0 0 0-.707 0z" />
														<path d="M13.683 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7.08a2 2 0 0 1-1.519-.698L.241 8.65a1 1 0 0 1 0-1.302L5.084 1.7A2 2 0 0 1 6.603 1h7.08zm-7.08 1a1 1 0 0 0-.76.35L1 8l4.844 5.65a1 1 0 0 0 .759.35h7.08a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-7.08z" />
													</svg>{" "}
													Go back to mainpage
												</Button>
											</Link>{" "}
										</Row>
										<InsertSurvey surveyList={surveyList}></InsertSurvey>
									</Container>
								</>
							) : (
								<Redirect to="/" />
							)
						}
					></Route>
					<Route
						path="/"
						render={() => (
							<>
								{loggedIn ? (
									<Redirect path="/" to="/admin" />
								) : (
									<>
										<NavigationBar
											loggedIn={loggedIn}
											login={login}
										></NavigationBar>
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
											<SurveyContainer
												surveyList={surveyList}
												survey={survey}
												setSurvey={setSurvey}
											></SurveyContainer>
										</Container>
										<Footer></Footer>
									</>
								)}
							</>
						)}
					></Route>
				</Switch>
			</Router>
		);
}

export default App;
