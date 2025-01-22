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
    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ message: "MONGODB_URI is not defined in environment variables" });
    }

    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      await client.connect();

      const database = client.db("book_db");
      const collection = database.collection("exchange_offers");

      const { exchangeOfferId, status } = req.body as {
        exchangeOfferId: string;
        status: "pending" | "accepted" | "declined";
      };

      // Validate input
      if (!exchangeOfferId || !status) {
        return res.status(400).json({ message: "Exchange offer ID and status are required" });
      }

      if (!["pending", "accepted", "declined"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }

      // Update the status of the exchange offer
      const result = await collection.updateOne(
        { _id: new ObjectId(exchangeOfferId) },
        { $set: { status } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Exchange offer not found" });
      }

      res.status(200).json({ message: "Exchange offer updated successfully", updatedCount: result.modifiedCount });
    } catch (error) {
      console.error("Error updating exchange offer:", error);
      res.status(500).json({ message: "Something went wrong!" });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Method not allowed!" });
  }
}
