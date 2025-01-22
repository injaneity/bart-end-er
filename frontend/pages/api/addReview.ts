import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

interface Review {
  writer: string; // Writer of the review
  book: string;   // Book ID
  text: string;   // Review text
  reposted: string[]; // Array of user IDs who reposted the review
}

interface ErrorResponse {
  message: string;
}

interface SuccessResponse {
  message: string;
  reviewId?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse | SuccessResponse>
) {
  if (req.method === "POST") {
    const { writer, book, text, reposted = [] } = req.body as {
      writer: string;
      book: string;
      text: string;
      reposted?: string[];
    };

    // Validate input
    if (!writer || !book || !text) {
      return res.status(400).json({ message: "Writer, book, and text are required" });
    }

    if (!Array.isArray(reposted) || !reposted.every((id) => typeof id === "string")) {
      return res.status(400).json({ message: "Reposted must be an array of user IDs (strings)" });
    }

    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ message: "MONGODB_URI is not defined in environment variables" });
    }

    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      await client.connect();

      const database = client.db("book_db");
      const collection = database.collection("reviews");

      const newReview: Review = {
        writer,
        book,
        text,
        reposted,
      };

      const result = await collection.insertOne(newReview);

      if (result.acknowledged) {
        res.status(201).json({ message: "Review created successfully!", reviewId: result.insertedId.toString() });
      } else {
        res.status(500).json({ message: "Failed to create review!" });
      }
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Something went wrong!" });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Method not allowed!" });
  }
}
