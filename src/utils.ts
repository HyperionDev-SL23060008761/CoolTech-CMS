//External Imports
import Cookies from "js-cookie";
import { Theme, defaultTheme } from "react-select";

//Internal Imports
import { RequestMethod } from "./types/types";

//Compares 2 Objects to See if They Are the Same
export function compareObjects(objectA: object, objectB: object): boolean {
	//Create a String of Object A
	const objectAString = JSON.stringify(objectA);

	//Create a String of Object B
	const objectBString = JSON.stringify(objectB);

	//Check if the 2 Objects are the Same
	const isSame = objectAString === objectBString;

	//Return the Result
	return isSame;
}

//Creates a Deep Copy of an Array or Object
export function deepCopy<T>(data: T): T {
	//Create the Deep Copy
	const newData = JSON.parse(JSON.stringify(data)) as T;

	//Return the New Data
	return newData;
}

//Runs a Fetch Request
export async function runRequest(
	apiURL: string,
	method: RequestMethod,
	query: { [key: string]: string } | null,
	body: object | null,
	requiresKey: boolean
	//eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any | Error> {
	//Get the Login Token from the Cookies
	const loginToken = Cookies.get("loginToken");

	//Check if the Login Token is Invalid
	if (requiresKey && !loginToken) return new Error("Invalid Login Token");

	//Setup the Query Parameters
	const queryParams = query ? new URLSearchParams(query).toString() : "";

	//Setup the Full URL
	let url = `${apiURL}`;

	//Check if the Query Parameters are Valid and Add them to the URL
	if (query) url = `${url}?${queryParams}`;

	//Setup the request data
	const requestData: RequestInit = {
		method: method,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${loginToken}`,
		},
	};

	//Check if the Request has a Body and set the Body in the Request Data
	if (method != "GET" && body) requestData.body = JSON.stringify(body);

	//Fetch the Data from the API
	const response = await fetch(url, requestData).catch(error => new Error(error.message));

	//Check if the Response is a Type of Error
	if (response instanceof Error) return response;

	//Get the Data from the Response
	const data = await response.json().catch(() => null);

	//Check if the Data Fetch Failed
	if (!response.ok) return new Error(data?.error || response.status.toString());

	//Check if the Data is Invalid
	if (!data) return body;

	//Return the Data
	return data;
}

//Setup the Dark Theme for the Select Box
export const selectBoxDarkTheme: Theme = {
	...defaultTheme,
	colors: {
		...defaultTheme.colors,
		//Primary Colors
		primary: "#374151", //Main color (e.g., selected item, borders)
		primary25: "#1f2937", //Focused option background

		//Neutral Colors
		neutral0: "#111827", //(likely a typo - should probably be a dark shade for text/icons on primary)
		neutral10: "#222222", //Main background color
		neutral60: "#FF0000", //(likely a typo - should probably be a lighter gray for inactive icons)
		neutral70: "#FF0000", //(likely a typo - should probably be a very light gray for subtle dividers)
		neutral80: "#ffffff", //Primary text color (e.g., option text, input text)
		neutral90: "#FF0000", //(likely a typo - should probably be white or very light gray for text on primary) } };
	},
};
