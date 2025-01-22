import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { booksTable } from './schema';

async function main() {
  const db = drizzle();

  // New book details to insert into the database
  const newBook: typeof booksTable.$inferInsert = {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    owner: 'user@example.com',
    publishDate: new Date('1937-09-21'),
    tags: ['fantasy', 'adventure', 'classic'],
    condition: 'new',
    isbn: '978-0-345-33968-3',
  };

  // Insert the new book into the database
  await db.insert(booksTable).values(newBook);
  console.log('Book added successfully!');

  // Select all books from the database
  const books = await db.select().from(booksTable);
  console.log('Getting all books from the database:', books);
  /*
  const books: {
    id: number;
    title: string;
    author: string;
    owner: string;
    publishDate: Date;
    tags: string[];
    condition: string;
    isbn: string | null;
    createdAt: Date;
  }[]
  */

  // Update the condition of the book
  await db
    .update(booksTable)
    .set({ condition: 'Good' })
    .where(eq(booksTable.isbn, newBook.isbn!));
  console.log('Book condition updated!');

  // Delete the book from the database
  await db.delete(booksTable).where(eq(booksTable.isbn, newBook.isbn!));
  console.log('Book deleted!');
}

main().catch((err) => {
  console.error('Error:', err);
});
