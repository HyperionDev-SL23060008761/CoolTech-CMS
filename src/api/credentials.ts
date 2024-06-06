//Internal Imports
import { Credentials } from "../types/types";
import { runRequest } from "../utils";

//Setup the API URL
const apiURL = `${import.meta.env.VITE_API_Url}/credentials`;

//Creates a Credentials
export async function create(credentialsData: Credentials): Promise<Credentials | Error> {
	//Get the Data from the Request
	const data = await runRequest(apiURL, "POST", null, credentialsData, true);

	//Check if the Data is a Type of Error
	if (data instanceof Error) return data;

	//Get the New Credentials from the Data
	const newCredentials = data as Credentials;

	//Return the New Credentials
	return newCredentials;
}

//Removes a Credentials
export async function remove(id: string): Promise<boolean | Error> {
	//Setup the Query Parameters
	const query = {
		id: id,
	};

	//Get the Data from the Request
	const data = await runRequest(apiURL, "DELETE", query, null, true);

	//Check if the Data is a Type of Error
	if (data instanceof Error) return data;

	//Return Successful Deletion
	return true;
}

//edits a Credentials
export async function edit(credentialsData: Credentials): Promise<Credentials | Error> {
	//Setup the Query Parameters
	const query = {
		id: credentialsData._id,
	};

	//Get the Data from the Request
	const data = await runRequest(apiURL, "PUT", query, credentialsData, true);

	//Check if the Data is a Type of Error
	if (data instanceof Error) return data;

	//Get the Updated Credentials from the Data
	const updatedCredentials = data as Credentials;

	//Return the Updated Credentials
	return updatedCredentials;
}

//Returns a Specified Credentials
export async function get(id: string): Promise<Credentials | Error> {
	//Setup the Query Parameters
	const query = {
		id: id,
	};

	//Get the Data from the Request
	const data = await runRequest(apiURL, "GET", query, null, true);

	//Check if the Data is a Type of Error
	if (data instanceof Error) return data;

	//Get the Credentials from the Data
	const credentials = data as Credentials;

	//Return the Credentials
	return credentials;
}

//Returns a List of Credentials for the Specified Division
export async function getForDivision(divisionID: string): Promise<Array<Credentials> | Error> {
	//Setup the Query Parameters
	const query = {
		id: divisionID,
	};

	//Get the Data from the Request
	const data = await runRequest(apiURL, "GET", query, null, true);

	//Check if the Data is a Type of Error
	if (data instanceof Error) return data;

	//Get the Credentials List from the Data
	const credentialsList = data as Array<Credentials>;

	//Return the Credentials List
	return credentialsList;
}
