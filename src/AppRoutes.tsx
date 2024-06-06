//External Imports
import { Route, Routes } from "react-router-dom";

//Internal Imports
import Home from "./pages/Home";
import LoginPage from "./pages/Login";
import OrganizationPage from "./pages/Organization";
import DivisionPage from "./pages/Division";
import CredentialsPage from "./pages/Credentials";
import UsersPage from "./pages/Users";
import ManageUserPage from "./pages/ManageUser";
import { useState } from "react";
import { api } from "./api/api";
import { User } from "./types/types";
import RegisterPage from "./pages/Register";

//Export the App Routes
export default function AppRoutes() {
	//Setup the State
	const [dataInitialized, setDataInitialized] = useState(false);
	const [user, setUser] = useState<User | null>(null);

	//Initialize the Page
	if (!dataInitialized) Initialize();

	//Initializes the Required Data for the Page
	async function Initialize() {
		//Set the Data Initialized Flag
		setDataInitialized(true);

		//Get the User's Data
		const userData = await api.user.getLoggedInUserData();

		//Check if the Data Fetch Failed
		if (userData instanceof Error) return;

		//Set the User
		setUser(userData);
	}

	//Return the Routes
	return (
		<Routes>
			<Route path="/" element={<Home user={user} />} />
			<Route path="/login" element={<LoginPage user={user} />} />
			<Route path="/register" element={<RegisterPage user={user} />} />
			<Route path="/organization/:id" element={<OrganizationPage user={user} />} />
			<Route path="/division/:id" element={<DivisionPage user={user} />} />
			<Route path="/credentials/:id" element={<CredentialsPage user={user} />} />
			<Route path="/users" element={<UsersPage user={user} />} />
			<Route path="/users/:id" element={<ManageUserPage user={user} />} />
		</Routes>
	);
}
