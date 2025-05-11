import dbClient from "@khel-mitra/db";
import { eq } from "@khel-mitra/db/drizzle";
import { logger } from "@khel-mitra/logger";
import { userPasswordTable, userTable } from "@khel-mitra/db/schemas";

import { isEmail } from "../utils/check.js";
import { generateFromEmail } from "unique-username-generator";

class UserService {
	constructor() {
		logger.info("UserService initialized");

		this.createUser = this.createUser.bind(this);
		this.insertUserCredentials = this.insertUserCredentials.bind(this);
		this.isUserAlreadyExists = this.isUserAlreadyExists.bind(this);
		this.isUsernameAlreadyExists = this.isUsernameAlreadyExists.bind(this);
		this.getUniqueUsername = this.getUniqueUsername.bind(this);
		this.getUserByEmailOrUsername = this.getUserByEmailOrUsername.bind(this);
		this.getUserById = this.getUserById.bind(this);
		this.getUserByEmail = this.getUserByEmail.bind(this);
		this.getUserByUsername = this.getUserByUsername.bind(this);
		this.getUserPassword = this.getUserPassword.bind(this);
	}

	isUserAlreadyExists(email: string) {
		return dbClient.query.userTable.findFirst({
			where: eq(userTable.email, email),
		});
	}

	isUsernameAlreadyExists(username: string) {
		return dbClient.query.userTable.findFirst({
			where: eq(userTable.username, username),
		});
	}

	async getUniqueUsername(email: string): Promise<string> {
		let username = generateFromEmail(email);

		while (true) {
			const existsUser = await this.isUsernameAlreadyExists(username);
			if (!existsUser) break;

			username += Math.floor(Math.random() * 100);
		}

		return username;
	}

	async createUser(email: string) {
		const username = await this.getUniqueUsername(email);

		return await dbClient
			.insert(userTable)
			.values({ email, username, name: "" })
			.returning()
			.then((res) => res[0]);
	}

	async insertUserCredentials(userId: string, password: string) {
		return await dbClient
			.insert(userPasswordTable)
			.values({ password, userId })
			.returning()
			.then((res) => res[0]);
	}

	async getUserByEmailOrUsername(emailOrUsername: string) {
		const isUserEmail = isEmail(emailOrUsername);

		if (isUserEmail) {
			return await this.getUserByEmail(emailOrUsername);
		} else {
			return await this.getUserByUsername(emailOrUsername);
		}
	}

	async getUserById(userId: string) {
		return await dbClient.query.userTable.findFirst({
			where: eq(userTable.id, userId),
		});
	}

	async getUserByEmail(email: string) {
		return await dbClient.query.userTable.findFirst({
			where: eq(userTable.email, email),
		});
	}

	async getUserByUsername(username: string) {
		return await dbClient.query.userTable.findFirst({
			where: eq(userTable.username, username),
		});
	}

	async getUserPassword(userId: string) {
		return await dbClient.query.userPasswordTable.findFirst({
			where: eq(userPasswordTable.userId, userId),
		});
	}
}

export { UserService };
