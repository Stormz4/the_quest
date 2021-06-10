import axios from "axios";


const BASEURL = '/api';

async function getAllSurveys(){
	let url = BASEURL + `/surveys`;
	try {
		const res = await axios.get(url);
		const data = await res.data;
		console.log(data);
		return data;
	} catch (error) {
		console.log(error);

	}
}

async function login(credentials) {
    console.log(JSON.stringify(credentials));
    let response = await fetch("/api/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(credentials),
		});
        console.log(response.data)
		if (response.ok) {
			const user = await response.json();
			return user;
		} else {
			try {
				const errDetail = await response.json();
				throw errDetail.message;
			} catch (err) {
				throw err;
			}
		}
}

async function logout() {
	await fetch("/api/login/current", { method: "DELETE" });
}

async function getAdminInfo() {
	const response = await fetch(BASEURL + "/login/current");
	const userInfo = await response.json();
	if (response.ok) {
		return userInfo;
	} else {
		throw userInfo; // an object with the error coming from the server
	}
}



const API = {
	getAllSurveys, login, logout, getAdminInfo
};
export default API;