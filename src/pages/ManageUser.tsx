//External Imports
import { useState } from "react";

//Internal Imports
import { Division, OrganizationDeep, Role, User } from "../types/types";
import Select from "react-select";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { api } from "../api/api";
import { selectBoxDarkTheme } from "../utils";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";

//Setup the Page
export default function ManageUserPage({ user }: { user: User | null }) {
	//Setup the State
	const [dataInitialized, setDataInitialized] = useState(false);
	const [requestedUser, setRequestedUser] = useState<User | null>(null);
	const [organizationsDeep, setOrganizationDeep] = useState<Array<OrganizationDeep> | null>(null);
	const [openedOrganization, setOpenedOrganization] = useState<OrganizationDeep | null>(null);

	//Initialize the Page
	if (!dataInitialized) Initialize();

	//Initializes the Required Data for the Page
	async function Initialize() {
		//Set the Data Initialized Flag
		setDataInitialized(true);

		//Split the URL Pathname
		const pathnameArray = window.location.pathname.split("/");

		//Get the Requested User's ID from the URL (URL Structure is: /user/:id)
		const requestedUserID = pathnameArray[pathnameArray.length - 1];

		//Check if the Requested User's ID is invalid and send the User to the Users Page
		if (!requestedUserID) return (window.location.href = "/users");

		//get the Requested User
		const requestedUser = await api.user.get(requestedUserID);

		//Check if the Data Fetch Failed
		if (requestedUser instanceof Error) return toast.error(requestedUser.message);

		//Get the List of Organizations
		const organizationsDeep = await api.organization.getAllWithDivisions();

		//Check if the Data Fetch Failed
		if (organizationsDeep instanceof Error) return toast.error(organizationsDeep.message);

		//Set the Requested User
		setRequestedUser(requestedUser);

		//Set the Organizations
		setOrganizationDeep(organizationsDeep);
	}

	//Setup the Change Role Handler
	async function changeRoleHandler(value: string) {
		//Check if the Requested User is Invalid
		if (!requestedUser) return;

		//Setup the New Role
		const newRole = value as Role;

		//Update the User's Role
		const updatedUser = await api.user.updateRole(requestedUser._id, newRole);

		//Check if the Data Update Failed
		if (updatedUser instanceof Error) return toast.error(updatedUser.message);

		//Log the User's Role Change
		toast.success(`${updatedUser.username}'s role has been changed to ${newRole}`);

		//Set the Requested User
		setRequestedUser(updatedUser);
	}

	//Toggles the Opened Organization
	function toggleOpenedOrganization(organization: OrganizationDeep) {
		//Check if the Opened Organization is the same as the Toggled Organization and close it
		if (openedOrganization == organization) return setOpenedOrganization(null);

		//Set the Opened Organization
		setOpenedOrganization(organization);
	}

	//Handles Division Toggle Events
	async function divisionToggleHandler(
		division: Division,
		event: React.MouseEvent<HTMLDivElement>
	) {
		//Stop the Event from Bubbling (Propegating the Event Upwards)
		event.stopPropagation();

		//Check if the Requested User is not Valid
		if (!requestedUser) return;

		//Setup the Variable toCheck if the Division Should be Removed
		const shouldRemove = requestedUser.divisions.includes(division._id);

		//Update the User's Divisions
		const updatedUser = await api.user.addRemoveDivision(requestedUser._id, division, shouldRemove);

		//Check if the Data Update Failed
		if (updatedUser instanceof Error) return toast.error(updatedUser.message);

		//Log the Successful Division Change
		toast.success(
			`${division.name} has been ${shouldRemove ? "removed" : "added"} from ${
				requestedUser.username
			}`
		);

		//Set the Requested User
		setRequestedUser(updatedUser);
	}

	//Handles Delete User Events
	async function deleteUserHandler() {
		//Check if the Requested User is not Valid
		if (!requestedUser) return;

		//Delete the User
		const deleteionResult = await api.user.deleteUser(requestedUser._id);

		//Check if the Data Update Failed
		if (deleteionResult instanceof Error) return toast.error(deleteionResult.message);

		//Log the Successful User Deletion
		toast.success(`${requestedUser.username} has been deleted`, {
			autoClose: 2000,
			onClose: () => (window.location.href = "/users"),
		});
	}

	//Setup the Available Roles
	const availableRoles = Object.keys(Role).filter(role => role !== "all");

	//Setup the Role Select Options
	const roleSelectOptions = availableRoles.map(role => {
		return { value: role as Role, label: role as Role };
	});

	//Return the Page's Content
	return (
		<div className="bg-gray-950 w-screen h-screen flex flex-col items-center gap-10">
			{/*Setup the Navbar*/}
			<Navbar user={user} title="Dashboard" backURL={`/users`} />

			{/*Setup the User Details Section*/}
			<div className="flex justify-center items-center px-5 flex-col w-3/4 gap-5">
				{/*Setup the User Details Header*/}
				<div className="flex justify-center gap-5 items-center">
					{/*Setup the User's Name*/}
					<h1 className=" text-4xl font-bold text-white">{requestedUser?.username}</h1>

					{/*Setup the Select Box to choose the User's Role (Admin, Management, or User)*/}
					{requestedUser && (
						<Select
							className="w-40"
							theme={selectBoxDarkTheme}
							options={roleSelectOptions}
							onChange={value => changeRoleHandler(value!.value)}
							defaultValue={{
								value: requestedUser.role,
								label: requestedUser.role,
							}}
						/>
					)}

					{/*Setup the Delete User Button*/}
					{user?._id !== requestedUser?._id && (
						<button
							className="px-5 h-full bg-red-600 hover:bg-red-700 rounded-md"
							onClick={() => deleteUserHandler()}
						>
							Delete User
						</button>
					)}
				</div>
			</div>

			{/*Setup the List of Organizations and Divisions for the User*/}
			<div className="flex gap-x-5 gap-y-5 flex-wrap justify-center w-3/4">
				{organizationsDeep &&
					organizationsDeep.map(organization => (
						<div
							onClick={() => toggleOpenedOrganization(organization)}
							className="px-4 py-4 w-1/4 bg-gray-800 rounded-md h-fit relative cursor-pointer flex justify-between items-center select-none"
							key={organization._id}
						>
							{/*Setup the Organization Name*/}
							<h2 className="text-lg font-bold text-white">{organization.name}</h2>

							{/*Setup the Closed Icon*/}
							{openedOrganization != organization && <IoIosArrowForward size={25} />}

							{/*Setup the Opened Icon*/}
							{openedOrganization == organization && <IoIosArrowDown size={25} color="#b91c1c" />}

							{/*Setup the List of Divisions for the Organization*/}
							<div className="absolute left-0 top-[120%] bg-gray-900 w-full z-10 overflow-auto max-h-60">
								{openedOrganization == organization &&
									organization.divisions.map(division => (
										<div key={division._id}>
											{/*Setup the Division Name*/}
											<div
												onClick={event => divisionToggleHandler(division, event)}
												aria-selected={requestedUser?.divisions.includes(division._id)}
												className="p-2 font-bold text-white border-b-white/50 border-b hover:bg-gray-800 opacity-25 aria-selected:opacity-100"
											>
												{division.name}
											</div>
										</div>
									))}
							</div>
						</div>
					))}
			</div>
		</div>
	);
}
