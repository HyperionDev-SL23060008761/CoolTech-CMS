//External Imports
import { toast } from "react-toastify";
import { useState } from "react";

//Internal Imports
import { Credentials, User } from "../types/types";
import { api } from "../api/api";
import Navbar from "../components/Navbar";
import { FaPen } from "react-icons/fa";
import { compareObjects, deepCopy } from "../utils";

//Setup the Page
export default function CredentialsPage({ user }: { user: User | null }) {
	//Setup the State
	const [isInitialized, setIsInitialized] = useState(false);
	const [credentials, setCredentials] = useState<Credentials>();
	const [isEditing, setIsEditing] = useState(false);
	const [editedData, setEditedData] = useState<Credentials>();

	//Initialize the Page
	if (!isInitialized) initialize();

	//Initializes the Required Data for the Page
	async function initialize() {
		//Update the Initialized State
		setIsInitialized(true);

		//Split the URL Pathname
		const pathnameArray = window.location.pathname.split("/");

		//Get the Credentials's ID from the URL (URL Structure is: /credentials/:id)
		const credentialsID = pathnameArray[pathnameArray.length - 1];

		//Check if the Credentials ID is invalid and send the User to the Home Page
		if (!credentialsID) return (window.location.href = "/");

		//Get the Credentials
		const credentials = await api.credentials.get(credentialsID);

		//Check if the Data Fetch Failed
		if (credentials instanceof Error) return toast.error(credentials.message);

		//Set the Credentials
		setCredentials(credentials);
	}

	//Toggles the Editing Process
	async function toggleEditing() {
		//Create a Deep Copy of the Credentials
		const credentialsCopy = deepCopy(credentials);

		//Check if the Credentials Copy is Invalid
		if (!credentialsCopy)
			return toast.error("Something Went Wrong... Please report this issue to us.");

		//Update the Edited Data
		setEditedData(credentialsCopy);

		//Update the Editing State
		setIsEditing(!isEditing);
	}

	//Handles Change Events
	async function handleChange(
		key: keyof Credentials,
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) {
		//Get the New Credentials
		const newCredentials = deepCopy(editedData);

		//Check if the New Credentials is Invalid
		if (!newCredentials)
			return toast.error("Something Went Wrong... Please report this issue to us.");

		//Update the New Credentials
		newCredentials[key] = event.target.value;
		console.log(key, event.target.value);

		//Set the Edited Credentials
		setEditedData(newCredentials);
	}

	//Handles Edit Events
	async function handleEdit() {
		//Check if the Edited Data is Invalid
		if (!editedData) return toast.error("Something Went Wrong... Please report this issue to us.");

		//Edit the Credentials
		const editedCredentials = await api.credentials.edit(editedData);

		//Check if the Edit Failed
		if (editedCredentials instanceof Error) return toast.error(editedCredentials.message);

		//Set the Credentials List
		setCredentials(editedCredentials);

		//Toggle the Editing Process
		toggleEditing();

		//Return Successful Edit
		toast.success("Credentials Edited Successfully");
	}

	//Check if the Edited Data is the Same as the Current Credentials
	const isSame = credentials && editedData ? compareObjects(credentials, editedData) : false;

	//Return the Page's Content
	return (
		<div className="bg-gray-950 w-screen h-screen flex flex-col items-center gap-10">
			{/*Setup the Navbar*/}
			<Navbar
				user={user}
				title={credentials?.name || "LOADING..."}
				backURL={`/division/${credentials?.division}`}
			/>

			{/*Setup the Credentials Section*/}
			<div className="flex justify-center px-5 flex-col w-2/4 gap-5 overflow">
				{/*Setup the Section Title*/}
				<div className="flex justify-end items-center">
					{/*Setup Management Buttons*/}
					{!isEditing && (
						<div className="flex gap-5 justify-center items-center">
							{/*Setup the Edit Credentials Button*/}
							<button
								disabled={user?.role !== "admin" && user?.role !== "management"}
								onClick={() => toggleEditing}
								className="text-yellow-500 hover:text-yellow-600 disabled:text-gray-500 disabled:hover:text-gray-500"
							>
								<FaPen size={15} />
							</button>
						</div>
					)}
				</div>

				{/*Setup the Credentials Content*/}
				<div className="flex flex-col gap-5">
					{/*Setup the Name Input Area*/}
					<div className="flex flex-col w-full h-full gap-2">
						{/*Setup the Label*/}
						<label htmlFor="name" className="font-bold text-gray-300">
							Name
						</label>

						{/*Setup the Input*/}
						<input
							id="name"
							name="name"
							className="bg-gray-800 rounded-md py-2 px-2"
							disabled={!isEditing}
							value={isEditing ? editedData?.name : credentials?.name}
							onChange={event => handleChange("name", event)}
						/>
					</div>

					{/*Setup the Username Input Area*/}
					<div className="flex flex-col w-full h-full gap-2">
						{/*Setup the Label*/}
						<label htmlFor="name" className="font-bold text-gray-300">
							Username
						</label>

						{/*Setup the Input*/}
						<input
							id="username"
							name="username"
							className="bg-gray-800 rounded-md py-2 px-2"
							disabled={!isEditing}
							value={isEditing ? editedData?.username : credentials?.username}
							onChange={event => handleChange("username", event)}
						/>
					</div>

					{/*Setup the Password Input Area*/}
					<div className="flex flex-col w-full h-full gap-2">
						{/*Setup the Label*/}
						<label htmlFor="name" className="font-bold text-gray-300">
							Password
						</label>

						{/*Setup the Input*/}
						<input
							id="password"
							name="password"
							className="bg-gray-800 rounded-md py-2 px-2"
							disabled={!isEditing}
							value={isEditing ? editedData?.password : credentials?.password}
							onChange={event => handleChange("password", event)}
						/>
					</div>

					{/*Setup the Notes Input Area*/}
					<div className="flex flex-col w-full h-full gap-2">
						{/*Setup the Label*/}
						<label htmlFor="name" className="font-bold text-gray-300">
							Notes
						</label>

						{/*Setup the Input*/}
						<textarea
							id="notes"
							name="notes"
							className="bg-gray-800 rounded-md py-2 px-2"
							disabled={!isEditing}
							value={isEditing ? editedData?.notes : credentials?.notes}
							onChange={event => handleChange("notes", event)}
						/>
					</div>

					{/*Setup the Form Action Button Area*/}
					{isEditing && (
						<div>
							{/*Setup the Submit Button*/}
							{!isSame && (
								<button
									type="submit"
									className="bg-green-700 hover:bg-green-800 w-full font-bold py-2 px-4 rounded"
									onClick={() => handleEdit()}
								>
									Save
								</button>
							)}

							{/*Setup the Cancel Button*/}
							{isSame && (
								<button
									onClick={() => toggleEditing()}
									className="bg-blue-600 hover:bg-blue-700 w-full font-bold py-2 px-4 rounded"
								>
									Cancel
								</button>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
