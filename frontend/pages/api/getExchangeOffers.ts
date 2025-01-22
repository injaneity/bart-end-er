import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

interface ExchangeOffer {
  id: string;
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
  exchangeOffers: ExchangeOffer[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse | SuccessResponse>
) {
  if (req.method === "GET") {
    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ message: "MONGODB_URI is not defined in environment variables" });
    }

    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      await client.connect();

      const database = client.db("book_db");
      const collection = database.collection("exchange_offers");

      // Fetch all exchange offers
      const exchangeOffers = await collection.find().toArray();

      // Format offers to include `id` as a string
      const formattedOffers: ExchangeOffer[] = exchangeOffers.map((offer) => ({
        id: offer._id.toString(),
        owner1: offer.owner1,
        book1: offer.book1,
        owner2: offer.owner2,
        book2: offer.book2,
        status: offer.status,
      }));

      res.status(200).json({ message: "Exchange offers retrieved successfully!", exchangeOffers: formattedOffers });
    } catch (error) {
      console.error("Error retrieving exchange offers:", error);
      res.status(500).json({ message: "Something went wrong!" });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Method not allowed!" });
  }
}
