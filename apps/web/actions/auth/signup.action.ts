"use server";

import db from "@khel-mitra/db";
import { userPasswordTable, userTable } from "@khel-mitra/db/schemas";
import { SignUpSchema, signUpSchema } from "@khel-mitra/shared/schemas";
import { existsUserByEmail } from "@/data/users.data";
import { getUniqueUsernameByEmail } from "@khel-mitra/shared/utils/getUniqueUsername";
import { zodValidation } from "@khel-mitra/shared/utils/zod-validation";
import { hashPassword } from "@khel-mitra/shared/utils/password";

export const signup = async (values: SignUpSchema) => {
	try {
		const { email, password } = zodValidation(signUpSchema, values);

		const hashedPassword = await hashPassword(password);
		const isUserAlreadyExists = await existsUserByEmail(email);

		if (isUserAlreadyExists) {
			return { error: "User already exists" };
		}

		// check in database user name is available or not
		const username = getUniqueUsernameByEmail(email);

		const user = await db.insert(userTable).values({ email, username }).returning();
		if (!user || !user[0]) return { error: "User not created" };
		await db
			.insert(userPasswordTable)
			.values({ password: hashedPassword, userId: user[0].id });

		return { success: "User signed up successfully" };
	} catch (error) {
		console.error(error);
		return { error: "User not created" };
	}
};
