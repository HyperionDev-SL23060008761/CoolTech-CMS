//External Imports
import { toast } from "react-toastify";

//Internal Imports
import { api } from "../api/api";
import { User } from "../types/types";

//Setup the Page
export default function RegisterPage({ user }: { user: User | null }) {
	//Check if the User is already logged in and send the User to the Home Page
	if (user) return (window.location.href = "/");

	//Handles Register Events
	async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
		//Prevent Default Form Submission
		event.preventDefault();

		//Get the Target Element
		const targetElement = event.currentTarget;

		//Get the Username
		const username = targetElement.username.value;

		//Get the Password
		const password = targetElement.password.value;

		//Get the Confirmed Password
		const confirmedPassword = targetElement.confirmPassword.value;

		//Check if the Confirmed Password is Invalid
		if (password !== confirmedPassword) return toast.error("The Passwords do not match");

		//Register the User and get the Token
		const token = await api.user.register(username, password, false, false);

		//Check if the Token is Invalid
		if (token instanceof Error) return toast.error(token.message);

		//Return Successful Registration
		toast.success("Registration Successful", {
			autoClose: 2000,
			onClose: () => (window.location.href = "/"),
		});
	}

	//Return the Page's Content
	return (
		<div className="bg-gray-950 w-screen h-screen flex justify-center items-center">
			{/*Setup the Register Area*/}
			<div className="rounded-md flex flex-col gap-10">
				{/*Setup the Title*/}
				<p className="font-bold text-4xl">Register a new account</p>

				{/*Setup the Form*/}
				<form onSubmit={handleRegister} className="flex flex-col gap-5">
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

					{/*Setup the Confirm Password Input Area*/}
					<div className="flex flex-col w-full h-full gap-2">
						{/*Setup the Label*/}
						<label htmlFor="confirmPassword" className="font-bold text-gray-300">
							Confirm Password
						</label>

						{/*Setup the Input*/}
						<input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							placeholder="Enter your Password Again"
							className="bg-gray-800 rounded-md py-2 px-2"
							required
						/>
					</div>

					{/*Setup the Login Message*/}
					<div className="flex gap-2">
						<p>Already Registere? </p>
						<a href="/login" className="font-bold text-red-600 hover:text-red-700">
							Login
						</a>
					</div>

					{/*Setup the Register Button*/}
					<button className="bg-red-700 py-2 rounded-md font-bold text-lg hover:bg-red-900">
						Register
					</button>
				</form>
			</div>
		</div>
	);
}
