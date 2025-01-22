'use client';

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useUser } from "@clerk/clerk-react";

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
  const { user } = useUser(); // Get the logged-in user's information
  const [isbn, setIsbn] = useState("");
  const [manualEntry, setManualEntry] = useState(false);
  const [bookDetails, setBookDetails] = useState<BookDetails>({
    title: "",
    author: "",
    owner: user?.username || "", // Set the default owner to the user's username
    publishDate: "",
    tags: "",
    condition: "",
    isbn: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingISBN, setLoadingISBN] = useState(false); // Loading state for ISBN lookup

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookDetails((prev) => ({ ...prev, [name]: value }));
  };

  interface OpenLibraryAuthor {
    name: string;
  }

  const handleISBNLookup = async () => {
    if (!isbn.trim()) {
      alert("Please enter a valid ISBN.");
      return;
    }

    setLoadingISBN(true);
    try {
      const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
      const data = await response.json();

      if (data[`ISBN:${isbn}`]) {
        const bookData = data[`ISBN:${isbn}`];
        setBookDetails((prev) => ({
          ...prev,
          title: bookData.title || "",
          author: bookData.authors?.map((author: OpenLibraryAuthor) => author.name).join(", ") || "",
          publishDate: bookData.publish_date || "",
          isbn,
        }));
        alert("Book details fetched successfully!");
      } else {
        alert("Book not found for the entered ISBN.");
      }
    } catch (error) {
      console.error("Error fetching book details:", error);
      alert("Failed to fetch book details.");
    } finally {
      setLoadingISBN(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...bookDetails,
      owner: user?.username || "", // Ensure the owner is set to the logged-in user's username
      tags: bookDetails.tags, // Keep tags as a string
    };

    console.log("Sending payload to API:", payload); // Log the payload being sent

    try {
      const response = await fetch("/api/addBook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Send the payload to the API
      });

      if (response.ok) {
        alert("Book added successfully!");
        // Reset the form
        setBookDetails({
          title: "",
          author: "",
          owner: user?.username || "", // Reset owner to the user's username
          publishDate: "",
          tags: "",
          condition: "",
          isbn: "",
        });
        setIsbn("");
      } else {
        const error = await response.json();
        console.error("Error from API:", error); // Log error from the API
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error adding book:", error); // Log error from the fetch call
      alert("Failed to add the book.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-xl  font-bold mb-4">Add a Book</h1>
      <form onSubmit={handleSubmit} className="space-y-4 ">
        {!manualEntry && (
          <div className="text-black">
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
                onClick={handleISBNLookup}
                className={`bg-blue-600 text-white py-2 px-4 rounded-md ${
                  loadingISBN ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loadingISBN}
              >
                {loadingISBN ? "Loading..." : "Autofill"}
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
          <div className="space-y-4 ">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={bookDetails.title}
                onChange={handleInputChange}
                className="text-black border rounded-md p-2 w-full"
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
                className="text-black border rounded-md p-2 w-full"
                placeholder="Enter author"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Publish Date</label>
              <input
                type="date"
                name="publishDate"
                value={bookDetails.publishDate}
                onChange={handleInputChange}
                className="text-black border rounded-md p-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <input
                type="text"
                name="tags"
                value={bookDetails.tags}
                onChange={handleInputChange}
                className="text-black border rounded-md p-2 w-full"
                placeholder="Enter tags (comma-separated)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Condition</label>
              <select
                name="condition"
                value={bookDetails.condition}
                onChange={handleSelectChange}
                className="text-black border rounded-md p-2 w-full"
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
          className={`bg-green-600 text-white py-2 px-4 rounded-md w-full ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Book"}
        </button>
      </form>
    </div>
  );
}
