//Internal Imports
import { Role } from "../types";

//Setup the User Token Interface
export interface TokenPayload {
	username: string;
	role: Role;
	divisions: Array<string>;
}
