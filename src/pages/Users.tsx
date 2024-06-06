//External Imports
import { useState } from "react";

//Internal Imports
import { User } from "../types/types";
import Navbar from "../components/Navbar";
import { api } from "../api/api";
import { IoIosArrowForward } from "react-icons/io";

//Setup the Page
export default function UsersPage({ user }: { user: User | null }) {
	//Setup the State
	const [dataInitialized, setDataInitialized] = useState(false);
	const [users, setUsers] = useState<Array<User>>(new Array<User>());

	//Initialize the Page
	if (!dataInitialized) Initialize();

	//Initializes the Required Data for the Page
	async function Initialize() {
		//Set the Data Initialized Flag
		setDataInitialized(true);

		//Get the List of Users
		const users = await api.user.getAll();

		//Check if the Data Fetch Failed
		if (users instanceof Error) return;

		//Set the Users
		setUsers(users);
	}

	//Return the Page's Content
	return (
		<div className="bg-gray-950 w-screen h-screen flex flex-col items-center gap-10">
			{/*Setup the Navbar*/}
			<Navbar user={user} title="Dashboard" backURL={`/`} />

			{/*Setup the Users Section*/}
			<div className="flex justify-center px-5 w-3/4 gap-5 flex-wrap">
				{users &&
					users.map(currentUser => (
						<div
							key={currentUser._id}
							onClick={() => (window.location.href = `/users/${currentUser._id}`)}
							className="relative flex w-1/5 rounded-md gap-5 px-2 py-5 justify-between items-center cursor-pointer bg-gray-800 hover:bg-gray-900"
						>
							{/*Setup the Username*/}
							<p className="font-bold bg-white/0 w-3/4 disabled:pointer-events-none">
								{currentUser.username}
							</p>

							{/*Setup the Arrow Icon*/}
							<IoIosArrowForward className="w-1/4" />
						</div>
					))}
			</div>
		</div>
	);
}
