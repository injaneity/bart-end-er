import {
  integer,
  pgTable,
  varchar,
  timestamp,
  json,
} from "drizzle-orm/pg-core";

// Books table
export const booksTable = pgTable("books", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  author: varchar({ length: 255 }).notNull(),
  owner: varchar({ length: 255 }).notNull(),
  publishDate: timestamp().notNull(),
  tags: json().notNull(), // Use JSON to store the tags array
  condition: varchar({ length: 50 }).notNull(),
  isbn: varchar({ length: 13 }),
  createdAt: timestamp().defaultNow().notNull(),
});
