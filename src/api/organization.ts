//Internal Imports
import { Organization, OrganizationDeep } from "../types/types";
import { runRequest } from "../utils";
import { api } from "./api";

//Setup the API URL
const apiURL = `${import.meta.env.VITE_API_Url}/organization`;

//Creates a Organization
export async function create(organizationData: Organization): Promise<Organization | Error> {
	//Get the Data from the Request
	const data = await runRequest(apiURL, "POST", null, organizationData, true);

	//Check if the Data is a Type of Error
	if (data instanceof Error) return data;

	//Get the New Organization from the Data
	const newOrganization = data as Organization;

	//Return the New Organization
	return newOrganization;
}

//Removes a Organization
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

//edits a Organization
export async function edit(organizationData: Organization): Promise<Organization | Error> {
	//Setup the Query Parameters
	const query = {
		id: organizationData._id,
	};

	//Get the Data from the Request
	const data = await runRequest(apiURL, "PUT", query, organizationData, true);

	//Check if the Data is a Type of Error
	if (data instanceof Error) return data;

	//Get the Updated Organization from the Data
	const updatedOrganization = data as Organization;

	//Return the Updated Organization
	return updatedOrganization;
}

//Returns a Specified Organization
export async function get(id: string): Promise<Organization | Error> {
	//Setup the Query Parameters
	const query = {
		id: id,
	};

	//Get the Data from the Request
	const data = await runRequest(apiURL, "GET", query, null, true);

	//Check if the Data is a Type of Error
	if (data instanceof Error) return data;

	//Get the Organization from the Data
	const organization = data as Organization;

	//Return the Organization
	return organization;
}

//Returns a List of Organizations
export async function getAll(): Promise<Array<Organization> | Error> {
	//Get the Data from the Request
	const data = await runRequest(apiURL, "GET", null, null, true);

	//Check if the Data is a Type of Error
	if (data instanceof Error) return data;

	//Get the Organization from the Data
	const organization = data as Array<Organization>;

	//Return the Organization
	return organization;
}

//Returns the List of Organizations and all the Divisions for Each Organization
export async function getAllWithDivisions(): Promise<Array<OrganizationDeep> | Error> {
	//Setup the List of Deep Organizations
	const organizationsDeep = new Array<OrganizationDeep>();

	//Get the List of all Organizations
	const organizations = await getAll();

	//Check if the Data Fetch Failed
	if (organizations instanceof Error) return organizations;

	//Loop through the Organizations
	for (const organization of organizations) {
		//Get the List of all Divisions for the Organization
		const divisions = await api.division.getForOrganization(organization._id);

		//Check if the Data Fetch Failed
		if (divisions instanceof Error) return divisions;

		//Setup the Deep Organization
		const organizationDeep: OrganizationDeep = {
			...organization,
			divisions: divisions,
		};

		//Add the Deep Organization to the List
		organizationsDeep.push(organizationDeep);
	}

	//Return the List of Deep Organizations
	return organizationsDeep;
}
