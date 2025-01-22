// pages/api/addBook.js

import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from 'next';

interface ErrorResponse {
    message: string;
}

interface SuccessResponse {
    message: string;
    bookId?: string;
}

interface Book {
    title: string;
    author: string;
    owner: string;
    publishDate: string;
    tags: string[];
    condition: string;
    isbn?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ErrorResponse | SuccessResponse>) {
    if (req.method === "POST") {
        if (!process.env.MONGODB_URI) {
            return res.status(500).json({ message: "MONGODB_URI is not defined in environment variables" });
        }
        const client = new MongoClient(process.env.MONGODB_URI);

        try {
            console.log("HERE FIRST");
            await client.connect();
            console.log("HERE SECOND");

            const database = client.db("book_db");
            const collection = database.collection("books");

            const { title, author, owner, publishDate, tags, condition, isbn } = req.body as {
                title: string;
                author: string;
                owner: string;
                publishDate: string;
                tags: string;
                condition: string;
                isbn?: string;
            };

            if (!title || !author || !owner || !publishDate || !tags || !condition) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const newBook: Book = {
                title,
                author,
                owner,
                publishDate,
                tags: tags.split(",").map(tag => tag.trim()),
                condition,
                isbn: isbn || undefined,
            };

            const result = await collection.insertOne(newBook);

            if (result.acknowledged) {
                res.status(201).json({ message: "Book added successfully!", bookId: result.insertedId.toString() });
            } else {
                res.status(500).json({ message: "Failed to add book!" });
            }
        } catch (error) {
            console.error("Error adding book:", error);
            res.status(500).json({ message: "Something went wrong!" });
        } finally {
            await client.close();
        }
    } else {
        res.status(405).json({ message: "Method not allowed!" });
    }
}
