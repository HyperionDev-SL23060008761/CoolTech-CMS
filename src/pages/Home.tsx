//External Imports
import { toast } from "react-toastify";
import { useState } from "react";
import { FaPen, FaPlus, FaTrash } from "react-icons/fa";

//Internal Imports
import { ManagementAction, Organization, User } from "../types/types";
import { api } from "../api/api";
import ListItem from "../components/ListItem";
import Navbar from "../components/Navbar";
import { deepCopy } from "../utils";

//Setup the Page
export default function Home({ user }: { user: User | null }) {
	//Setup the State
	const [dataInitialized, setDataInitialized] = useState(false);
	const [organizations, setOrganizations] = useState<Array<Organization>>(new Array());
	const [managementAction, setManagementAction] = useState<ManagementAction>(null);

	//Initialize the Page
	if (!dataInitialized) initialize();

	//Initializes the Required Data for the Page
	async function initialize() {
		//Set the Data Initialized Flag
		setDataInitialized(true);

		//Get the List of Organizations
		const organizations = await api.organization.getAll();

		//Check if the Data Fetch Failed
		if (organizations instanceof Error) return toast.error(organizations.message);

		//Set the Organizations List
		setOrganizations(organizations);
	}

	//Handle Create Organization Events
	async function handleCreateOrganization() {
		//Setup the Organization Data
		const organizationData: Organization = {
			_id: "",
			name: "New Organization",
		};

		//Create the Organization
		const newOrganization = await api.organization.create(organizationData);

		//Check if the Creation Failed
		if (newOrganization instanceof Error) return toast.error(newOrganization.message);

		//Create the New Organizations List
		const newOrganizations = [...organizations, newOrganization];

		//Set the Organizations List
		setOrganizations(newOrganizations);
	}

	//Handles organization Delete Events
	async function handleDelete(itemID: string) {
		//Get the New Organizations List
		const newOrganizations = deepCopy(organizations);

		//Get the Index of the Organization
		const index = newOrganizations.findIndex(
			currentOrganization => currentOrganization._id === itemID
		);

		//Check if the Organization Index is Invalid
		if (index === -1) return toast.error("Organization Not Found");

		//Delete the Organization
		const deletionStatus = await api.organization.remove(itemID);

		//Check if the Deletion Failed
		if (deletionStatus instanceof Error) return toast.error(deletionStatus.message);

		//Remove the Organization
		newOrganizations.splice(index, 1);

		//Set the Organizations List
		setOrganizations(newOrganizations);

		//Return Successful Deletion
		toast.success("Organization Deleted Successfully");
	}

	//Handles organization Edit Events
	async function handleEdit(itemID: string, newTitle: string) {
		//Get the New Organizations List
		const newOrganizations = deepCopy(organizations);

		//Get the Index of the Organization
		const index = newOrganizations.findIndex(
			currentOrganization => currentOrganization._id === itemID
		);

		//Check if the Organization Index is Invalid
		if (index === -1) return toast.error("Organization Not Found");

		//Get the Current Organization
		const currentOrganization = newOrganizations[index];

		//Update the Organization Name
		currentOrganization.name = newTitle;

		//Edit the Organization
		const editedOrganization = await api.organization.edit(currentOrganization);

		//Check if the Edit Failed
		if (editedOrganization instanceof Error) return toast.error(editedOrganization.message);

		//Update the Organization
		newOrganizations[index] = editedOrganization;

		//Set the Organizations List
		setOrganizations(newOrganizations);

		//Return Successful Edit
		toast.success("Organization Edited Successfully");
	}

	//Return the Page's Content
	return (
		<div className="bg-gray-950 w-screen h-screen flex flex-col items-center gap-10">
			{/*Setup the Navbar*/}
			<Navbar user={user} title="Dashboard" />

			{/*Setup the Organizations Section*/}
			<div className="flex justify-center px-5 flex-col w-3/4 gap-5 overflow">
				{/*Setup the Section Title*/}
				<div className="flex justify-between items-center">
					{/*Setup the Title*/}
					<p className="text-2xl font-bold">Organizations</p>

					{/*Setup Management Buttons*/}
					{!managementAction && (
						<div className="flex gap-5 justify-center items-center">
							{/*Setup the Add Organization Button*/}
							<button
								disabled={user?.role !== "admin"}
								onClick={handleCreateOrganization}
								className="text-green-500 hover:text-green-600 disabled:text-gray-500 disabled:hover:text-gray-500"
							>
								<FaPlus size={15} />
							</button>

							{/*Setup the Edit Organization Button*/}
							<button
								disabled={user?.role !== "admin"}
								onClick={() => setManagementAction("edit")}
								className="text-yellow-500 hover:text-yellow-600 disabled:text-gray-500 disabled:hover:text-gray-500"
							>
								<FaPen size={15} />
							</button>

							{/*Setup the Delete Organization Button*/}
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

				{/*Setup the List of Organizations*/}
				<div className="flex flex-wrap">
					{organizations &&
						organizations.map(organization => (
							<div key={organization._id} className="w-1/3 px-5 py-2">
								<ListItem
									itemID={organization._id}
									title={organization.name}
									url={`/organization/${organization._id}`}
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
