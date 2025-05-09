import { generateFromEmail, generateUsername } from "unique-username-generator";

export const getUniqueUsernameByEmail = (email: string): string => {
	return generateFromEmail(email, 6);
};

export const getUniqueUsername = (): string => {
	return generateUsername("_", 4, 15, "user");
};
