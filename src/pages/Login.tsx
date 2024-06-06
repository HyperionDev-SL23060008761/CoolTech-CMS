//External Imports
import { toast } from "react-toastify";

//Internal Imports
import { api } from "../api/api";
import { User } from "../types/types";

//Setup the Page
export default function LoginPage({ user }: { user: User | null }) {
	//Check if the User is already logged in and send the User to the Home Page
	if (user) return (window.location.href = "/");

	//Handles Login Events
	async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
		//Prevent Default Form Submission
		event.preventDefault();

		//Get the Target Element
		const targetElement = event.currentTarget;

		//Get the Username
		const username = targetElement.username.value;

		//Get the Password
		const password = targetElement.password.value;

		//Log the User in and get the Token
		const token = await api.user.login(username, password);

		//Check if the Token is Invalid
		if (token instanceof Error) return toast.error(token.message);

		//Return Successful Login
		toast.success("Login Successful", {
			autoClose: 2000,
			onClose: () => (window.location.href = "/"),
		});
	}

	//Return the Page's Content
	return (
		<div className="bg-gray-950 w-screen h-screen flex justify-center items-center">
			{/*Setup the Login Area*/}
			<div className="rounded-md flex flex-col gap-10">
				{/*Setup the Title*/}
				<p className="font-bold text-4xl">Sign in to your account</p>

				{/*Setup the Form*/}
				<form onSubmit={handleLogin} className="flex flex-col gap-5">
					{/*Setup the Username Input Area*/}
					<div className="flex flex-col w-full h-full gap-2">
						{/*Setup the Label*/}
						<label htmlFor="username" className="font-bold text-gray-300">
							Username
						</label>

						{/*Setup the Input*/}
						<input
							id="username"
							name="username"
							type="text"
							placeholder="Enter your Username"
							className="bg-gray-800 rounded-md py-2 px-2"
							required
						/>
					</div>

					{/*Setup the Password Input Area*/}
					<div className="flex flex-col w-full h-full gap-2">
						{/*Setup the Label*/}
						<label htmlFor="password" className="font-bold text-gray-300">
							Password
						</label>

						{/*Setup the Input*/}
						<input
							id="password"
							name="password"
							type="password"
							placeholder="Enter your Password"
							className="bg-gray-800 rounded-md py-2 px-2"
							required
						/>
					</div>

					{/*Setup the Register Message*/}
					<div className="flex gap-2">
						<p>Don't have an account? </p>
						<a href="/register" className="font-bold text-red-600 hover:text-red-700">
							Register
						</a>
					</div>

					{/*Setup the Login Button*/}
					<button className="bg-red-700 py-2 rounded-md font-bold text-lg hover:bg-red-900">
						Login
					</button>
				</form>
			</div>
		</div>
	);
}
