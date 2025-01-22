import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

interface Review {
  id: string;
  writer: string;
  book: string;
  text: string;
}

interface ErrorResponse {
  message: string;
}

interface SuccessResponse {
  message: string;
  reviews: Review[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse | SuccessResponse>
) {
  if (req.method === "GET") {
    const { writer } = req.query;

    if (!writer || typeof writer !== "string") {
      return res.status(400).json({ message: "Writer is required and must be a string" });
    }

    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ message: "MONGODB_URI is not defined in environment variables" });
    }

    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      await client.connect();

      const database = client.db("book_db");
      const collection = database.collection("reviews");

      const reviews = await collection.find({ writer }).toArray();

      const formattedReviews: Review[] = reviews.map((review) => ({
        id: review._id.toString(),
        writer: review.writer,
        book: review.book,
        text: review.text,
      }));

      res.status(200).json({ message: "Reviews retrieved successfully!", reviews: formattedReviews });
    } catch (error) {
      console.error("Error retrieving reviews by writer:", error);
      res.status(500).json({ message: "Something went wrong!" });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Method not allowed!" });
  }
}
