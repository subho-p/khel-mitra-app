import {
	pgTable,
	varchar,
	boolean,
	integer,
	timestamp,
	serial,
	primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { text } from "drizzle-orm/pg-core";

/**
 * User table
 */
export const userTable = pgTable("users", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),

	name: varchar("name", { length: 100 }),
	username: varchar("username", { length: 100 }).unique().notNull(),
	email: varchar("email", { length: 100 }).unique().notNull(),

	coins: integer("coins").notNull().default(1000),

	emailVerified: timestamp("email_verified", { mode: "date" }),
	onboarded: timestamp("onboarded"),

	image: text("image"),

	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Accounts table
 */
export const accountsTable = pgTable(
	"account",
	{
		userId: text("user_id")
			.notNull()
			.references(() => userTable.id, { onDelete: "cascade" }),
		type: text("type").notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("providerAccountId").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		session_state: text("session_state"),
	},
	(account) => [
		{
			compoundKey: primaryKey({
				columns: [account.provider, account.providerAccountId],
			}),
		},
	]
);

/**
 * User password table
 */
export const userPasswordTable = pgTable("user_passwords", {
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id, { onDelete: "cascade" })
		.unique(),

	password: varchar("password", { length: 100 }).notNull(),

	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * User password relationship
 */
export const userPasswordRelations = relations(userPasswordTable, ({ one }) => ({
	user: one(userTable, {
		fields: [userPasswordTable.userId],
		references: [userTable.id],
	}),
}));

/**
 * User sessions table
 */
export const sessionTable = pgTable("sessions", {
	sessionToken: text("session_token").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id, { onDelete: "cascade" }),
	prevSessionId: integer("prev_session_id"),

	expires: timestamp("expires", { mode: "date" }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * User email verification table
 */
export const verificationTokenTable = pgTable(
	"verification_tokens",
	{
		identifier: text("identifier").notNull(),
		token: text("token").notNull(),
		expires: timestamp("expires", { mode: "date" }).notNull(),
	},
	(verificationToken) => [
		{
			compositePk: primaryKey({
				columns: [verificationToken.identifier, verificationToken.token],
			}),
		},
	]
);

/**
 * User authenticators table
 */
export const authenticatorTable = pgTable(
	"authenticators",
	{
		credentialID: text("credentialID").notNull().unique(),
		userId: text("userId")
			.notNull()
			.references(() => userTable.id, { onDelete: "cascade" }),
		providerAccountId: text("providerAccountId").notNull(),
		credentialPublicKey: text("credentialPublicKey").notNull(),
		counter: integer("counter").notNull(),
		credentialDeviceType: text("credentialDeviceType").notNull(),
		credentialBackedUp: boolean("credentialBackedUp").notNull(),
		transports: text("transports"),
	},
	(authenticator) => [
		{
			compositePK: primaryKey({
				columns: [authenticator.userId, authenticator.credentialID],
			}),
		},
	]
);
