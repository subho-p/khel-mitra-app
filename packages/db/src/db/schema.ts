import { pgTable, varchar, boolean, integer, timestamp, serial } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { text } from "drizzle-orm/pg-core";

/**
 * User table
 */
export const userTable = pgTable("users", {
	id: serial("id").primaryKey(),

	name: varchar("name", { length: 100 }),
	username: varchar("username", { length: 100 }).unique().notNull(),
	email: varchar("email", { length: 100 }).unique().notNull(),

	coins: integer("coins").notNull().default(1000),

	verified: timestamp("verified"),
	onboarded: timestamp("onboarded"),

	avatarId: integer("avatar_id")
		.references(() => avatarTable.id, { onDelete: "set null" })
		.default(1),

	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * User relationship
 */
export const userRelations = relations(userTable, ({ one }) => ({
	avatar: one(avatarTable, {
		fields: [userTable.avatarId],
		references: [avatarTable.id],
	}),
}));

/**
 * User password table
 */
export const userPasswordTable = pgTable("user_passwords", {
	userId: integer("user_id")
		.notNull()
		.unique()
		.references(() => userTable.id, { onDelete: "cascade" }),

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
	id: serial("id").primaryKey(),

	userId: integer("user_id")
		.notNull()
		.references(() => userTable.id, { onDelete: "cascade" }),

	token: varchar("token", { length: 100 }).notNull(),
	revoked: boolean("revoked").notNull().default(false),

	prevSessionId: integer("prev_session_id"),

	expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Session relationships
 */
export const sessionRelations = relations(sessionTable, ({ one }) => ({
	user: one(userTable, {
		fields: [sessionTable.userId],
		references: [userTable.id],
	}),
	prevSession: one(sessionTable, {
		fields: [sessionTable.prevSessionId],
		references: [sessionTable.id],
	}),
}));

/**
 * User avatar table
 */
export const avatarTable = pgTable("avatars", {
	id: serial("id").primaryKey(),

	url: text("url").notNull(),
	publicId: varchar("public_id", { length: 255 }).notNull(),

	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
