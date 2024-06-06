//External Imports
import { toast } from "react-toastify";
import { useState } from "react";
import { FaPen, FaPlus, FaTrash } from "react-icons/fa";

//Internal Imports
import { ManagementAction, Credentials, Division, User } from "../types/types";
import { api } from "../api/api";
import ListItem from "../components/ListItem";
import Navbar from "../components/Navbar";
import { deepCopy } from "../utils";

//Setup the Page
export default function DivisionPage({ user }: { user: User | null }) {
	//Setup the State
	const [dataInitialized, setDataInitialized] = useState(false);
	const [division, setDivision] = useState<Division>();
	const [credentials, setCredentials] = useState<Array<Credentials>>(new Array());
	const [managementAction, setManagementAction] = useState<ManagementAction>(null);

	//Initialize the Page
	if (!dataInitialized) initialize();

	//Initializes the Required Data for the Page
	async function initialize() {
		//Set the Data Initialized Flag
		setDataInitialized(true);

		//Split the URL Pathname
		const pathnameArray = window.location.pathname.split("/");

		//Get the Division's ID from the URL (URL Structure is: /division/:id)
		const divisionID = pathnameArray[pathnameArray.length - 1];

		//Check if the Division ID is invalid and send the User to the Home Page
		if (!divisionID) return (window.location.href = "/");

		//Get the Division from the API
		const division = await api.division.get(divisionID);

		//Check if the Division is Invalid
		if (division instanceof Error) return toast.error(division.message);

		//Get the List of Credentials
		const credentials = await api.credentials.getForDivision(divisionID);

		//Check if the Data Fetch Failed
		if (credentials instanceof Error) return toast.error(credentials.message);

		//Set the Division
		setDivision(division);

		//Set the Credentials List
		setCredentials(credentials);
	}

	//Handle Create Credentials Events
	async function handleCreateCredentials() {
		//Check if the Division is Invalid
		if (!division) return toast.error("Division Not Found");

		//Setup the Credentials Data
		const credentialsData: Credentials = {
			_id: "",
			name: "New Credentials",
			division: division?._id,
			username: "SampleUsername",
			password: "SamplePassword",
			notes: "",
		};

		//Create the Credentials
		const newCredentials = await api.credentials.create(credentialsData);

		//Check if the Creation Failed
		if (newCredentials instanceof Error) return toast.error(newCredentials.message);

		//Create the New Credentials List
		const newCredentialList = [...credentials, newCredentials];

		//Set the Credentials List
		setCredentials(newCredentialList);
	}

	//Handles credentials Delete Events
	async function handleDelete(itemID: string) {
		//Get the New Credentials List
		const newCredentials = deepCopy(credentials);

		//Get the Index of the Credentials
		const index = newCredentials.findIndex(currentCredentials => currentCredentials._id === itemID);

		//Check if the Credentials Index is Invalid
		if (index === -1) return toast.error("Credentials Not Found");

		//Delete the Credentials
		const deletionStatus = await api.credentials.remove(itemID);

		//Check if the Deletion Failed
		if (deletionStatus instanceof Error) return toast.error(deletionStatus.message);

		//Remove the Credentials
		newCredentials.splice(index, 1);

		//Set the Credentials List
		setCredentials(newCredentials);

		//Return Successful Deletion
		toast.success("Credentials Deleted Successfully");
	}

	//Handles credentials Edit Events
	async function handleEdit(itemID: string, newTitle: string) {
		//Get the New Credentials List
		const newCredentials = deepCopy(credentials);

		//Get the Index of the Credentials
		const index = newCredentials.findIndex(currentCredentials => currentCredentials._id === itemID);

		//Check if the Credentials Index is Invalid
		if (index === -1) return toast.error("Credentials Not Found");

		//Get the Current Credentials
		const currentCredentials = newCredentials[index];

		//Update the Credentials Name
		currentCredentials.name = newTitle;

		//Edit the Credentials
		const editedCredentials = await api.credentials.edit(currentCredentials);

		//Check if the Edit Failed
		if (editedCredentials instanceof Error) return toast.error(editedCredentials.message);

		//Update the Credentials
		newCredentials[index] = editedCredentials;

		//Set the Credentials List
		setCredentials(newCredentials);

		//Return Successful Edit
		toast.success("Credentials Edited Successfully");
	}

	//Return the Page's Content
	return (
		<div className="bg-gray-950 w-screen h-screen flex flex-col items-center gap-10">
			{/*Setup the Navbar*/}
			<Navbar
				user={user}
				title={division?.name || "LOADING..."}
				backURL={`/organization/${division?.organization}`}
			/>

			{/*Setup the Credentials Section*/}
			<div className="flex justify-center px-5 flex-col w-3/4 gap-5 overflow">
				{/*Setup the Section Title*/}
				<div className="flex justify-between items-center">
					{/*Setup the Title*/}
					<p className="text-2xl font-bold">Credentials</p>

					{/*Setup Management Buttons*/}
					{!managementAction && (
						<div className="flex gap-5 justify-center items-center">
							{/*Setup the Add Credentials Button*/}
							<button
								onClick={handleCreateCredentials}
								className="text-green-500 hover:text-green-600 disabled:text-gray-500 disabled:hover:text-gray-500"
							>
								<FaPlus size={15} />
							</button>

							{/*Setup the Edit Credentials Button*/}
							<button
								disabled={user?.role !== "admin" && user?.role !== "management"}
								onClick={() => setManagementAction("edit")}
								className="text-yellow-500 hover:text-yellow-600 disabled:text-gray-500 disabled:hover:text-gray-500"
							>
								<FaPen size={15} />
							</button>

							{/*Setup the Delete Credentials Button*/}
							<button
								disabled={user?.role !== "admin" && user?.role !== "management"}
								onClick={() => setManagementAction("delete")}
								className="text-red-500 hover:text-red-600 disabled:text-gray-500 disabled:hover:text-gray-500"
							>
								<FaTrash size={15} />
							</button>
						</div>
					)}

					{/*Setup the Cancel Management Button*/}
					{managementAction && (
						<button
							onClick={() => setManagementAction(null)}
							className="h-full bg-blue-600 hover:bg-blue-700 px-4 rounded-md font-bold"
						>
							Cancel
						</button>
					)}
				</div>

				{/*Setup the List of Credentials*/}
				<div className="flex flex-wrap">
					{credentials &&
						credentials.map(credentials => (
							<div key={credentials._id} className="w-1/3 px-5 py-2">
								<ListItem
									itemID={credentials._id}
									title={credentials.name}
									url={`/credentials/${credentials._id}`}
									managementAction={managementAction}
									onEdit={handleEdit}
									onDelete={handleDelete}
								/>
							</div>
						))}
				</div>
			</div>
		</div>
	);
}
