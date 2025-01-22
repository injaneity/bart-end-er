import { MongoClient, ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

interface ErrorResponse {
  message: string;
}

interface SuccessResponse {
  message: string;
  deletedCount?: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse | SuccessResponse>
) {
  if (req.method === "DELETE") {
    const { reviewId } = req.body as { reviewId: string };

    // Validate input
    if (!reviewId) {
      return res.status(400).json({ message: "Review ID is required" });
    }

    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ message: "MONGODB_URI is not defined in environment variables" });
    }

    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      await client.connect();

      const database = client.db("book_db");
      const collection = database.collection("reviews");

      // Delete the review by ID
      const result = await collection.deleteOne({ _id: new ObjectId(reviewId) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Review not found" });
      }

      res.status(200).json({ message: "Review deleted successfully", deletedCount: result.deletedCount });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Something went wrong!" });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Method not allowed!" });
  }
}
