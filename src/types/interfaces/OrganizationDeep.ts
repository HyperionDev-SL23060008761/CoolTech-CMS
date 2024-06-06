import { Organization, Division } from "../types";

//Setup the Organization Deep Interface
export interface OrganizationDeep extends Organization {
	divisions: Array<Division>;
}
