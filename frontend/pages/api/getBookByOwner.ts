import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { Book } from "../../app/util/types";

interface ErrorResponse {
  message: string;
}

interface SuccessResponse {
  message: string;
  books: Book[] | undefined;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse | SuccessResponse>
) {
  if (req.method === "GET") {
    const { owner } = req.query;

    if (!owner || typeof owner !== "string") {
      return res.status(400).json({ message: "Owner is required and must be a string" });
    }

    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ message: "MONGODB_URI is not defined in environment variables" });
    }

    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      await client.connect();

      const database = client.db("book_db");
      const collection = database.collection("books");

      const books = await collection.find({ owner }).toArray();
      const formattedBooks: Book[] = books.map((book) => ({
        id: book._id.toString(),
        title: book.title,
        owner: book.owner,
        author: book.author,
        publishDate: book.publishDate,
        genre: book.genre,
        tags: book.tags,
        condition: book.condition,
      }));

      res.status(200).json({ message: "Books retrieved successfully!", books: formattedBooks });
    } catch (error) {
      console.error("Error retrieving books by owner:", error);
      res.status(500).json({ message: "Something went wrong!" });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Method not allowed!" });
  }
}
