import { MongoClient, ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

interface ErrorResponse {
  message: string;
}

interface SuccessResponse {
  message: string;
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
      const collection = database.collection("reviews");

      const { id, reposted } = req.body;
      console.log(req.body);


      if (!id || !Array.isArray(reposted)) {
        return res.status(400).json({ message: "Invalid request body" });
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(id) }, // Convert `id` to an ObjectId
        { $set: { reposted: reposted } } // Update the `reposted` field with the array
    );
      

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Review not found" });
      }

      res.status(200).json({ message: "Review updated successfully!" });
    } catch (error) {
      console.error("Error updating review:", error);
      res.status(500).json({ message: "Something went wrong!" });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Method not allowed!" });
  }
}
