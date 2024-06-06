//External Imports
import Cookies from "js-cookie";

//Internal Imports
import { runRequest } from "../utils";
import { Division, Role, User } from "../types/types";

//Setup the API URL
const apiURL = `${import.meta.env.VITE_API_Url}`;

//Returns the List of all Users
export async function getAll(): Promise<Array<User> | Error> {
	//Setup the Full URL
	const url = `${apiURL}/user/user`;

	//Get the Data from the Request
	const data = await runRequest(url, "GET", null, null, true);

	//Check if the Data is a Type of Error
	if (data instanceof Error) return data;

	//Get the User List from the Data
	const users = data as Array<User>;

	//Return the User List
	return users;
}

//Returns a User by the Specified ID
export async function get(id: string): Promise<User | Error> {
	//Setup the Full URL
	const url = `${apiURL}/user/user`;

	//Setup the Query Parameters
	const query = {
		id: id,
	};

	//Get the Data from the Request
	const data = await runRequest(url, "GET", query, null, true);

	//Check if the Data is a Type of Error
	if (data instanceof Error) return data;

	//Get the User from the Data
	const user = data as User;

	//Return the User
	return user;
}

//Returns the User's Data
export async function getLoggedInUserData(): Promise<User | Error> {
	//Setup the Full URL
	const url = `${apiURL}/user/details`;

	//Get the Data from the Request
	const data = await runRequest(url, "GET", null, null, true);

	//Check if the Data is a Type of Error
	if (data instanceof Error) return data;

	//Get the User from the Data
	const user = data as User;

	//Return the User
	return user;
}

//Logs a User In using the API
export async function login(username: string, password: string): Promise<string | Error> {
	//Setup the Request Body
	const requestBody = {
		username: username,
		password: password,
	};

	//Setup the Full URL
	const url = `${apiURL}/user/login`;

	//Get the Data from the Request
	const data = await runRequest(url, "POST", null, requestBody, false);

	//Check if the Data is a Type of Error
	if (data instanceof Error) return data;

	//Get the JWT from the Data
	const token = data.token as string;

	//Save the JWT in the Cookies
	Cookies.set("loginToken", token, { expires: 1 });

	//Return the JWT Token
	return token;
}

//Register's a User In using the API
export async function register(
	username: string,
	password: string,
	isAdmin: boolean,
	isManagement: boolean
): Promise<string | Error> {
	//Setup the Request Body
	const requestBody: {
		username: string;
		password: string;
		isAdmin?: boolean;
		isManagement?: boolean;
	} = {
		username: username,
		password: password,
	};

	//Check if the Admin Flag is Set
	if (isAdmin) requestBody.isAdmin = true;

	//Check if the Management Flag is Set
	if (isManagement) requestBody.isManagement = true;

	//Setup the Full URL
	const url = `${apiURL}/user/register`;

	//Get the Data from the Request
	const data = await runRequest(url, "POST", null, requestBody, false);

	//Check if the Data is a Type of Error
	if (data instanceof Error) return data;

	//Get the JWT from the Data
	const token = data.token as string;

	//Save the JWT in the Cookies
	Cookies.set("loginToken", token, { expires: 1 });

	//Return the JWT Token
	return token;
}

//Register's a User In using the API
export async function updateRole(id: string, newRole: Role): Promise<User | Error> {
	//Setup the Query Parameters
	const query = {
		id: id,
	};

	//Setup the Request Body
	const requestBody = {
		role: newRole,
	};

	//Setup the Full URL
	const url = `${apiURL}/user/user`;

	//Get the Data from the Request
	const data = await runRequest(url, "PUT", query, requestBody, true);

	//Check if the Data is a Type of Error
	if (data instanceof Error) return data;

	//Get the Updated User from the Data
	const updatedUser = data as User;

	//Return the Updated User
	return updatedUser;
}

//Adds a Division to the User
export async function addRemoveDivision(
	id: string,
	division: Division,
	remove: boolean
): Promise<User | Error> {
	//Setup the Query Parameters
	const query = {
		id: id,
	};

	//Setup the Request Body
	const requestBody = {
		division: division._id,
	};

	//Setup the Full URL
	const url = `${apiURL}/user/${remove ? "removeDivision" : "addDivision"}`;

	//Get the Data from the Request
	const data = await runRequest(url, "PUT", query, requestBody, true);

	//Check if the Data is a Type of Error
	if (data instanceof Error) return data;

	//Get the Updated User from the Data
	const updatedUser = data as User;

	//Return the Updated User
	return updatedUser;
}

//Deletes a User from the API
export async function deleteUser(id: string): Promise<true | Error> {
	//Setup the Full URL
	const url = `${apiURL}/user`;

	//Setup the Query Parameters
	const query = {
		id: id,
	};

	//Get the Data from the Request
	const data = await runRequest(url, "DELETE", query, null, true);

	//Check if the Data is a Type of Error
	if (data instanceof Error) return data;

	//Return the User
	return true;
}

//Validates a User's JWT Token
export async function validateToken(): Promise<boolean> {
	//Setup the Full URL
	const url = `${apiURL}/validateToken`;

	//Get the Data from the Request
	const data = await runRequest(url, "GET", null, null, true);

	//Check if the Data is a Type of Error
	if (data instanceof Error) return false;

	//Return Valid JWT
	return true;
}
