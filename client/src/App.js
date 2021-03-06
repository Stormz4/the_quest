import "./App.css";
import { Container, Button, Row } from "react-bootstrap";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
	Link,
} from "react-router-dom";
import NavigationBar from "./NavigationBar.js";
import Footer from "./Footer";
import SurveyContainer from "./SurveyContainer";
import { useState, useEffect } from "react";
import API from "./API";
import InsertSurvey from "./InsertSurvey";

/*
	This component contains the states regarding a certain survey, the entire survey list, the dirty bit (used to show the updates),
	the login and the loading (which is used when you log to render the surveys properly.)
	Other than that, handles the login/logout/checks if a user is logged in, 
	uses API methods to get the surveys/the surveys for a specific admin 
	and contains all the routes, while also rendering the main pages both for loggend and not-logged users.

*/
function App() {
	const [surveyList, setSurveyList] = useState([]);
	const [survey, setSurvey] = useState({});
	const [dirty, setDirty] = useState(true);
	const [loggedIn, setLoggedIn] = useState(false);
	const [loading, setLoading] = useState(true);
	const [name, setName] = useState("");

	const login = async (credentials) => {
		try {
			const userInfo = await API.login(credentials);
			setLoggedIn(true);
			setDirty(true);
			setName(userInfo);
			return true;
		} catch (err) {
			alert(err);
			return false;
		}
	};

	const logout = async () => {
		await API.logout();
		setLoggedIn(false);
		setName("");
		setSurveyList([]);
	};

	useEffect(() => {
		const checkAuth = async () => {
			try {
				let userInfo = await API.getAdminInfo();
				setLoggedIn(true);
				setName(userInfo);
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
		};

		setLoading(true);
		if (!loggedIn) {
			getAllSurveys().then(() => {
				setDirty(false);
				setLoading(false);
			});
		} else {
			getAllSurveysById().then(() => {
				setDirty(false);
				setLoading(false);
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
										<h2>Welcome, {name}!</h2>{" "}
									</Row>
									{loading ? (
										<>
											<br></br>
											<br></br>
											<br></br>
											<h3>🕗 Please wait, loading your surveys... 🕗</h3>
										</>
									) : (
										<SurveyContainer
											loggedIn={loggedIn}
											survey={survey}
											setSurvey={setSurvey}
											surveyList={surveyList}
										></SurveyContainer>
									)}
								</Container>
								<Footer></Footer>
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
													className="bi bi-backspace"
													viewBox="0 0 16 16"
												>
													<path d="M5.83 5.146a.5.5 0 0 0 0 .708L7.975 8l-2.147 2.146a.5.5 0 0 0 .707.708l2.147-2.147 2.146 2.147a.5.5 0 0 0 .707-.708L9.39 8l2.146-2.146a.5.5 0 0 0-.707-.708L8.683 7.293 6.536 5.146a.5.5 0 0 0-.707 0z" />
													<path d="M13.683 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7.08a2 2 0 0 1-1.519-.698L.241 8.65a1 1 0 0 1 0-1.302L5.084 1.7A2 2 0 0 1 6.603 1h7.08zm-7.08 1a1 1 0 0 0-.76.35L1 8l4.844 5.65a1 1 0 0 0 .759.35h7.08a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-7.08z" />
												</svg>{" "}
												Go back to mainpage
											</Button>
										</Link>{" "}
									</Row>
									<InsertSurvey
										setDirty={setDirty}
										surveyList={surveyList}
									></InsertSurvey>
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
													className="bi bi-list-nested"
													viewBox="0 0 16 16"
												>
													<path
														fillRule="evenodd"
														d="M4.5 11.5A.5.5 0 0 1 5 11h10a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm-2-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm-2-4A.5.5 0 0 1 1 3h10a.5.5 0 0 1 0 1H1a.5.5 0 0 1-.5-.5z"
													/>
												</svg>
											</h2>
										</Row>
										{loading ? (
											<>
												<br></br>
												<br></br>
												<br></br>
												<h3>🕗 Please wait, loading your surveys... 🕗</h3>
											</>
										) : (
											<SurveyContainer
												surveyList={surveyList}
												survey={survey}
												setSurvey={setSurvey}
											></SurveyContainer>
										)}
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
