import { MongoClient, ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

interface ErrorResponse {
  message: string;
}

interface SuccessResponse {
  message: string;
  updatedCount?: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse | SuccessResponse>
) {
  if (req.method === "PUT") {
    const { bookId, newOwner } = req.body as {
      bookId: string;
      newOwner: string;
    };

    // Validate input
    if (!bookId || !newOwner) {
      return res.status(400).json({ message: "Book ID and new owner are required" });
    }

    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ message: "MONGODB_URI is not defined in environment variables" });
    }

    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      await client.connect();

      const database = client.db("book_db");
      const collection = database.collection("books");

      // Update the owner of the book
      const result = await collection.updateOne(
        { _id: new ObjectId(bookId) },
        { $set: { owner: newOwner } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Book not found" });
      }

      res.status(200).json({ message: "Book owner updated successfully", updatedCount: result.modifiedCount });
    } catch (error) {
      console.error("Error updating book:", error);
      res.status(500).json({ message: "Something went wrong!" });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Method not allowed!" });
  }
}
