//External Imports
import React, { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { FaCheck, FaTrash } from "react-icons/fa";

//Internal Imports
import { ManagementAction } from "../types/types";

//Setup the Component
export default function ListItem({
	itemID,
	title,
	url,
	managementAction,
	className,
	onEdit,
	onDelete,
}: {
	itemID: string;
	title: string;
	url: string;
	managementAction: ManagementAction;
	className?: string;
	onEdit: (itemID: string, newTitle: string) => void;
	onDelete: (itemID: string) => void;
}) {
	//Setup the State
	const [editedTitle, setEditedTitle] = useState<string>(title);

	//Check if the Management Action is not Editing and update the Edit Title
	if (managementAction !== "edit" && editedTitle !== title) setEditedTitle(title);

	//Setup the Variable to Check if the Item Title and Edited Title is The Same
	const isSameTitle = title == editedTitle;

	//Handles Redirects
	async function handleRedirect() {
		//Check if the Item is currently being managed and ignore the redirect request
		if (managementAction !== null) return;

		//Redirect to the URL
		window.location.href = url;
	}

	//Return the Component's Content
	return (
		<div
			onClick={handleRedirect}
			className={`relative w-full h-fit flex flex-col gap-5 max-h-[70vh] ${className || ""}`}
		>
			{/*Setup the Item Title Area*/}
			<div className="relative flex w-full rounded-md gap-5 px-2 py-5 justify-between items-center cursor-pointer bg-gray-800 hover:bg-gray-900">
				{/*Setup the Item Title Input*/}
				<input
					className={`font-bold bg-white/0 w-3/4 disabled:pointer-events-none ${
						managementAction == "edit" && "border-b border-b-yellow-500"
					}`}
					onChange={e => setEditedTitle(e.target.value)}
					value={editedTitle}
					disabled={managementAction != "edit"}
				/>

				{/*Setup the Delete Overlay*/}
				{managementAction == "delete" && (
					<button
						className="top-0 right-0 h-full w-1/4 absolute bg-red-600 hover:bg-red-700 flex justify-center items-center rounded-md"
						onClick={() => onDelete(itemID)}
					>
						<FaTrash />
					</button>
				)}

				{/*Setup the Save Overlay*/}
				{managementAction == "edit" && (
					<button
						className={`top-0 right-0 h-full w-1/4 absolute bg-green-600 hover:bg-green-700 disabled:bg-gray-500 flex justify-center items-center rounded-md`}
						onClick={() => onEdit(itemID, editedTitle)}
						disabled={isSameTitle}
					>
						<FaCheck />
					</button>
				)}

				{/*Setup the Arrow Icon*/}
				<IoIosArrowForward className="w-1/4" />
			</div>
		</div>
	);
}
