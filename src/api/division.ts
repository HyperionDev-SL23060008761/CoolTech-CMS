//Internal Imports
import { Division } from "../types/types";
import { runRequest } from "../utils";

//Setup the API URL
const apiURL = `${import.meta.env.VITE_API_Url}/division`;

//Creates a Division
export async function create(divisionData: Division): Promise<Division | Error> {
	//Get the Data from the Request
	const data = await runRequest(apiURL, "POST", null, divisionData, true);

	//Check if the Data is a Type of Error
	if (data instanceof Error) return data;

	//Get the New Division from the Data
	const newDivision = data as Division;

	//Return the New Division
	return newDivision;
}

//Removes a Division
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

//edits a Division
export async function edit(divisionData: Division): Promise<Division | Error> {
	//Setup the Query Parameters
	const query = {
		id: divisionData._id,
	};

	//Get the Data from the Request
	const data = await runRequest(apiURL, "PUT", query, divisionData, true);

	//Check if the Data is a Type of Error
	if (data instanceof Error) return data;

	//Get the Updated Division from the Data
	const updatedDivision = data as Division;

	//Return the Updated Division
	return updatedDivision;
}

//Returns a Specified Division
export async function get(id: string): Promise<Division | Error> {
	//Setup the Query Parameters
	const query = {
		id: id,
	};

	//Get the Data from the Request
	const data = await runRequest(apiURL, "GET", query, null, true);

	//Check if the Data is a Type of Error
	if (data instanceof Error) return data;

	//Get the Division from the Data
	const division = data as Division;

	//Return the Division
	return division;
}

//Returns a List of Divisions for the Specified Organization
export async function getForOrganization(organizationID: string): Promise<Array<Division> | Error> {
	//Setup the Query Parameters
	const query = {
		id: organizationID,
	};

	//Get the Data from the Request
	const data = await runRequest(apiURL, "GET", query, null, true);

	//Check if the Data is a Type of Error
	if (data instanceof Error) return data;

	//Get the Divisions from the Data
	const divisions = data as Array<Division>;

	//Return the Divisions
	return divisions;
}
