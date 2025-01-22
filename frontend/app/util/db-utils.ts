import 'dotenv/config';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { booksTable } from '../../db/schema';

export async function addBookToDatabase(bookDetails: {
  title: string;
  author: string;
  owner: string;
  publishDate: string;
  tags: string[];
  condition: string;
  isbn?: string;
}) {
  const db = drizzle();

  // Create the book entry
  const book: typeof booksTable.$inferInsert = {
    title: bookDetails.title,
    author: bookDetails.author,
    owner: bookDetails.owner,
    publishDate: new Date(bookDetails.publishDate), // Ensure it's in Date format
    tags: bookDetails.tags,
    condition: bookDetails.condition,
    isbn: bookDetails.isbn,
  };

  try {
    await db.insert(booksTable).values(book);
    console.log('New book added to the database!');
  } catch (error) {
    console.error('Failed to add book:', error);
    throw new Error('Database error: Failed to add book.');
  }
}
