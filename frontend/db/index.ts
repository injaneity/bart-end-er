import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import {
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

// Use this object to send drizzle queries to your DB
export const db = drizzle(sql);

// Create a pgTable that maps to the books table in your DB
export const booksTable = pgTable(
  'books',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    author: text('author').notNull(),
    owner: text('owner').notNull(),
    publishDate: timestamp('publishDate').notNull(),
    tags: text('tags').array().notNull(),
    condition: text('condition').notNull(),
    isbn: text('isbn'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
);

export const getBooks = async () => {
  const selectResult = await db.select().from(booksTable);
  console.log('Books:', selectResult);
};