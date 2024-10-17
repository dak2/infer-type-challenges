import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  googleUserId: text("google_user_id"), // NOTE: This column is nullable because another oauth flow might be used.
  name: text("name").notNull(),
});
