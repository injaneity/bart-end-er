import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

interface ExchangeOffer {
  owner1: string;
  book1: string;
  owner2: string;
  book2: string;
  status: "pending" | "accepted" | "declined";
}

interface ErrorResponse {
  message: string;
}

interface SuccessResponse {
  message: string;
  exchangeOfferId?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse | SuccessResponse>
) {
  if (req.method === "POST") {
    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ message: "MONGODB_URI is not defined in environment variables" });
    }

    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      await client.connect();

      const database = client.db("book_db");
      const collection = database.collection("exchange_offers");

      const { owner1, book1, owner2, book2 } = req.body as {
        owner1: string;
        book1: string;
        owner2: string;
        book2: string;
      };

      // Validate input fields
      if (!owner1 || !book1 || !owner2 || !book2) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Create a new exchange offer
      const newExchangeOffer: ExchangeOffer = {
        owner1,
        book1,
        owner2,
        book2,
        status: "pending", // Default status
      };

      const result = await collection.insertOne(newExchangeOffer);

      if (result.acknowledged) {
        res
          .status(201)
          .json({ message: "Exchange offer created successfully!", exchangeOfferId: result.insertedId.toString() });
      } else {
        res.status(500).json({ message: "Failed to create exchange offer!" });
      }
    } catch (error) {
      console.error("Error creating exchange offer:", error);
      res.status(500).json({ message: "Something went wrong!" });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Method not allowed!" });
  }
}
