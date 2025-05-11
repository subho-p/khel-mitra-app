import { userTable } from "@khel-mitra/db/schemas";

export type User = typeof userTable.$inferSelect;
