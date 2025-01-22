'use client';

import React, { useState, ChangeEvent, FormEvent } from "react";
import { addBookToDatabase } from "../util/db-utils"; // Adjust the path based on your setup

type BookDetails = {
  title: string;
  author: string;
  owner: string;
  publishDate: string;
  tags: string;
  condition: string;
  isbn?: string;
};

export default function AddBook() {
  const [isbn, setIsbn] = useState("");
  const [manualEntry, setManualEntry] = useState(false);
  const [bookDetails, setBookDetails] = useState<BookDetails>({
    title: "",
    author: "",
    owner: "",
    publishDate: "",
    tags: "",
    condition: "",
    isbn: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addBookToDatabase({
        ...bookDetails,
        tags: bookDetails.tags.split(",").map((tag) => tag.trim()), // Convert tags to array
      });
      alert("Book added successfully!");
      // Reset the form
      setBookDetails({
        title: "",
        author: "",
        owner: "",
        publishDate: "",
        tags: "",
        condition: "",
        isbn: "",
      });
      setIsbn("");
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add the book.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Add a Book</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!manualEntry && (
          <div>
            <label className="block text-sm font-medium mb-1">ISBN</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                className="border rounded-md p-2 flex-grow"
                placeholder="Enter ISBN"
              />
              <button
                type="button"
                onClick={() => setManualEntry(true)}
                className="bg-blue-600 text-white py-2 px-4 rounded-md"
              >
                Autofill
              </button>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Manual Entry</label>
          <input
            type="checkbox"
            checked={manualEntry}
            onChange={(e) => setManualEntry(e.target.checked)}
          />
        </div>

        {manualEntry && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={bookDetails.title}
                onChange={handleInputChange}
                className="border rounded-md p-2 w-full"
                placeholder="Enter title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Author</label>
              <input
                type="text"
                name="author"
                value={bookDetails.author}
                onChange={handleInputChange}
                className="border rounded-md p-2 w-full"
                placeholder="Enter author"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Owner</label>
              <input
                type="text"
                name="owner"
                value={bookDetails.owner}
                onChange={handleInputChange}
                className="border rounded-md p-2 w-full"
                placeholder="Enter owner"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Publish Date</label>
              <input
                type="date"
                name="publishDate"
                value={bookDetails.publishDate}
                onChange={handleInputChange}
                className="border rounded-md p-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <input
                type="text"
                name="tags"
                value={bookDetails.tags}
                onChange={handleInputChange}
                className="border rounded-md p-2 w-full"
                placeholder="Enter tags (comma-separated)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Condition</label>
              <select
                name="condition"
                value={bookDetails.condition}
                onChange={handleSelectChange}
                className="border rounded-md p-2 w-full"
              >
                <option value="">Select condition</option>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
          </div>
        )}

        <button
          type="submit"
          className={`bg-green-600 text-white py-2 px-4 rounded-md w-full ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Book"}
        </button>
      </form>
    </div>
  );
}
