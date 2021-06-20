import {Navbar, Button, Row, Container} from "react-bootstrap"
import { Link } from "react-router-dom"
import { useState } from "react";
import LoginModal from "./LoginModal"

// This component represents the navbar of the webapp, which is rendered differenty for logged and non logged users.

function NavigationBar (props) {
	const [show, setShow] = useState(false);
    return (
			<div>
				<Navbar collapseOnSelect className="p-2" expand="md" variant="light">
					<Container
						fluid
						className="justify-content-between align-items-center"
					>
						<Navbar.Brand>
							<Row className="align-items-center ml-1">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="32"
									height="32"
									fill="currentColor"
									class="bi bi-patch-question"
									viewBox="0 0 16 16"
								>
									<path d="M8.05 9.6c.336 0 .504-.24.554-.627.04-.534.198-.815.847-1.26.673-.475 1.049-1.09 1.049-1.986 0-1.325-.92-2.227-2.262-2.227-1.02 0-1.792.492-2.1 1.29A1.71 1.71 0 0 0 6 5.48c0 .393.203.64.545.64.272 0 .455-.147.564-.51.158-.592.525-.915 1.074-.915.61 0 1.03.446 1.03 1.084 0 .563-.208.885-.822 1.325-.619.433-.926.914-.926 1.64v.111c0 .428.208.745.585.745z" />
									<path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911l-1.318.016z" />
									<path d="M7.001 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0z" />
								</svg>
								<h2 className="m-1">TheQuest</h2>
							</Row>
						</Navbar.Brand>

						<div className="mr-1">
							{props.loggedIn ? (
								<>
									<Link to="/insert" style={{ textDecoration: "none" }}>
										<Button
											href="/insert"
											variant="success"
											className="ml-0 p-2"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="32"
												height="32"
												fill="currentColor"
												class="bi bi-file-earmark-text"
												viewBox="0 0 16 16"
											>
												<path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
												<path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
											</svg>{" "}
											Add a survey
										</Button>{" "}
									</Link>
									<Button
										variant="danger"
										className="p-2"
										onClick={() => {
											props.logout();
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="32"
											height="32"
											fill="currentColor"
											class="bi bi-door-closed"
											viewBox="0 0 16 16"
										>
											<path d="M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V2zm1 13h8V2H4v13z" />
											<path d="M9 9a1 1 0 1 0 2 0 1 1 0 0 0-2 0z" />
										</svg>{" "}
										Logout
									</Button>
								</>
							) : (
								<Button
									variant="success"
									className=""
									onClick={() => {
										setShow(true);
									}}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="32"
										height="32"
										fill="currentColor"
										class="bi bi-door-open"
										viewBox="0 0 16 16"
									>
										<path d="M8.5 10c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z" />
										<path d="M10.828.122A.5.5 0 0 1 11 .5V1h.5A1.5 1.5 0 0 1 13 2.5V15h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117zM11.5 2H11v13h1V2.5a.5.5 0 0 0-.5-.5zM4 1.934V15h6V1.077l-6 .857z" />
									</svg>{" "}
									Login
								</Button>
							)}
						</div>
					</Container>

					<Container fluid className="d-md-none m-0">
						<Navbar.Collapse id="responsive-navbar-nav"></Navbar.Collapse>
					</Container>
				</Navbar>

				<LoginModal
					login={props.login}
					modify={props.modify}
					show={show}
					setShow={setShow}
					setModify={props.setModify}
					setDirty={props.setDirty}
					user={props.user}
				></LoginModal>
			</div>
		);
}

export default NavigationBar;