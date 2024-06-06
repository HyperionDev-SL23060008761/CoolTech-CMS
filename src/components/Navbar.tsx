//External Imports
import React from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

//Internal Imports
import { api } from "../api/api";
import { FaArrowLeft } from "react-icons/fa";
import { Role, User } from "../types/types";

//Setup the Component
export default function Navbar({
	title,
	backURL,
	user,
}: {
	title: string;
	backURL?: string;
	user: User | null;
}) {
	//Check if the User is Logged In
	checkLoginStatus();

	//Checks if the User is Logged In
	async function checkLoginStatus() {
		//Validate the Current Token
		const isValid = await api.user.validateToken();

		//Check if the Token is Invalid and send the User to the Login Page
		if (!isValid) return (window.location.href = "/login");
	}

	//Handles Logout Events
	async function handleLogout(event: React.MouseEvent<HTMLButtonElement>) {
		//Prevent Default Form Submission
		event.preventDefault();

		//Remove the Login Token from the Cookies
		Cookies.remove("loginToken");

		//Return Successful Logout
		toast.success("Logged Out Successfully", { autoClose: 2000, onClose: checkLoginStatus });
	}

	//Return the Component's Content
	return (
		<div className="w-full h-14 bg-gray-900 flex justify-between">
			{/*Setup the Title Section*/}
			<div className="h-full flex justify-center items-center px-5 gap-5">
				{/*Setup the Back Button*/}
				{backURL && (
					<FaArrowLeft
						onClick={() => {
							window.location.href = backURL;
						}}
						className="cursor-pointer pt-1 text-red-500"
						size={24}
					/>
				)}

				{/*Setup the Title*/}
				<p className="text-2xl text-white font-bold">{title}</p>
			</div>

			{/*Setup the Button Area*/}
			<div className="h-full flex">
				{/*Setup the User Button*/}
				{user?.role === Role.admin && (
					<button
						onClick={() => (window.location.href = "/users")}
						className="border-l border-black text-white font-bold bg-blue-800 hover:bg-blue-900 h-full aspect-[14/9]"
					>
						Users
					</button>
				)}

				{/*Setup the Logout Button*/}
				<button
					onClick={handleLogout}
					className="border-l-2 border-black text-white font-bold bg-red-700 hover:bg-red-900 h-full aspect-[14/9]"
				>
					Logout
				</button>
			</div>
		</div>
	);
}
