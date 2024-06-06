//External Imports
import { toast } from "react-toastify";
import { useState } from "react";
import { FaPen, FaPlus, FaTrash } from "react-icons/fa";

//Internal Imports
import { ManagementAction, Division, Organization, User } from "../types/types";
import { api } from "../api/api";
import ListItem from "../components/ListItem";
import Navbar from "../components/Navbar";
import { deepCopy } from "../utils";

//Setup the Page
export default function OrganizationPage({ user }: { user: User | null }) {
	//Setup the State
	const [dataInitialized, setDataInitialized] = useState(false);
	const [organization, setOrganization] = useState<Organization>();
	const [divisions, setDivisions] = useState<Array<Division>>(new Array());
	const [managementAction, setManagementAction] = useState<ManagementAction>(null);

	//Initialize the Page
	if (!dataInitialized) initialize();

	//Initializes the Required Data for the Page
	async function initialize() {
		//Set the Data Initialized Flag
		setDataInitialized(true);

		//Split the URL Pathname
		const pathnameArray = window.location.pathname.split("/");

		//Get the Organization's ID from the URL (URL Structure is: /organization/:id)
		const organizationID = pathnameArray[pathnameArray.length - 1];

		//Check if the Organization ID is invalid and send the User to the Home Page
		if (!organizationID) return (window.location.href = "/");

		//Get the Organization from the API
		const organization = await api.organization.get(organizationID);

		//Check if the Organization is Invalid
		if (organization instanceof Error) return toast.error(organization.message);

		//Get the List of Divisions
		const divisions = await api.division.getForOrganization(organizationID);

		//Check if the Data Fetch Failed
		if (divisions instanceof Error) return toast.error(divisions.message);

		//Set the Organization
		setOrganization(organization);

		//Set the Divisions List
		setDivisions(divisions);
	}

	//Handle Create Division Events
	async function handleCreateDivision() {
		//Check if the Organization is Invalid
		if (!organization) return toast.error("Organization Not Found");

		//Setup the Division Data
		const divisionData: Division = {
			_id: "",
			name: "New Division",
			organization: organization?._id,
		};

		//Create the Division
		const newDivision = await api.division.create(divisionData);

		//Check if the Creation Failed
		if (newDivision instanceof Error) return toast.error(newDivision.message);

		//Create the New Divisions List
		const newDivisions = [...divisions, newDivision];

		//Set the Divisions List
		setDivisions(newDivisions);
	}

	//Handles division Delete Events
	async function handleDelete(itemID: string) {
		//Get the New Divisions List
		const newDivisions = deepCopy(divisions);

		//Get the Index of the Division
		const index = newDivisions.findIndex(currentDivision => currentDivision._id === itemID);

		//Check if the Division Index is Invalid
		if (index === -1) return toast.error("Division Not Found");

		//Delete the Division
		const deletionStatus = await api.division.remove(itemID);

		//Check if the Deletion Failed
		if (deletionStatus instanceof Error) return toast.error(deletionStatus.message);

		//Remove the Division
		newDivisions.splice(index, 1);

		//Set the Divisions List
		setDivisions(newDivisions);

		//Return Successful Deletion
		toast.success("Division Deleted Successfully");
	}

	//Handles division Edit Events
	async function handleEdit(itemID: string, newTitle: string) {
		//Get the New Divisions List
		const newDivisions = deepCopy(divisions);

		//Get the Index of the Division
		const index = newDivisions.findIndex(currentDivision => currentDivision._id === itemID);

		//Check if the Division Index is Invalid
		if (index === -1) return toast.error("Division Not Found");

		//Get the Current Division
		const currentDivision = newDivisions[index];

		//Update the Division Name
		currentDivision.name = newTitle;

		//Edit the Division
		const editedDivision = await api.division.edit(currentDivision);

		//Check if the Edit Failed
		if (editedDivision instanceof Error) return toast.error(editedDivision.message);

		//Update the Division
		newDivisions[index] = editedDivision;

		//Set the Divisions List
		setDivisions(newDivisions);

		//Return Successful Edit
		toast.success("Division Edited Successfully");
	}

	//Return the Page's Content
	return (
		<div className="bg-gray-950 w-screen h-screen flex flex-col items-center gap-10">
			{/*Setup the Navbar*/}
			<Navbar user={user} title={organization?.name || "LOADING..."} backURL={"/"} />

			{/*Setup the Divisions Section*/}
			<div className="flex justify-center px-5 flex-col w-3/4 gap-5 overflow">
				{/*Setup the Section Title*/}
				<div className="flex justify-between items-center">
					{/*Setup the Title*/}
					<p className="text-2xl font-bold">Divisions</p>

					{/*Setup Management Buttons*/}
					{!managementAction && (
						<div className="flex gap-5 justify-center items-center">
							{/*Setup the Add Division Button*/}
							<button
								disabled={user?.role !== "admin"}
								onClick={handleCreateDivision}
								className="text-green-500 hover:text-green-600 disabled:text-gray-500 disabled:hover:text-gray-500"
							>
								<FaPlus size={15} />
							</button>

							{/*Setup the Edit Division Button*/}
							<button
								disabled={user?.role !== "admin"}
								onClick={() => setManagementAction("edit")}
								className="text-yellow-500 hover:text-yellow-600 disabled:text-gray-500 disabled:hover:text-gray-500"
							>
								<FaPen size={15} />
							</button>

							{/*Setup the Delete Division Button*/}
							<button
								disabled={user?.role !== "admin"}
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

				{/*Setup the List of Divisions*/}
				<div className="flex flex-wrap">
					{divisions &&
						divisions.map(division => (
							<div key={division._id} className="w-1/3 px-5 py-2">
								<ListItem
									itemID={division._id}
									title={division.name}
									url={`/division/${division._id}`}
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
