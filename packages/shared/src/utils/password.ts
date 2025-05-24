import agron from "argon2";

export const hashPassword = async (password: string) => await agron.hash(password);

export const verifyPassword = async (password: string, hash: string) =>
	await agron.verify(hash, password);
