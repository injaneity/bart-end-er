'use client';

import React, { useState, ChangeEvent, FormEvent } from "react";

// Define the type for book details explicitly
type BookDetails = {
  title: string;
  author: string;
  owner: string;
  publishDate: string;
  tags: string;
  condition: string;
};

export default function AddBook() {
  const [isbn, setIsbn] = useState("");
  const [manualEntry, setManualEntry] = useState(false);

  // Explicitly type the bookDetails state
  const [bookDetails, setBookDetails] = useState<BookDetails>({
    title: "",
    author: "",
    owner: "",
    publishDate: "",
    tags: "",
    condition: "",
  });

  // Handler for <input> elements
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookDetails(prev => ({ ...prev, [name as keyof BookDetails]: value }));
  };

  // Handler for <select> elements
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookDetails(prev => ({ ...prev, [name as keyof BookDetails]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Book Details:", manualEntry ? bookDetails : { isbn });
    alert("Book added successfully!");
  };

  const handleIsbnSearch = () => {
    // Simulate ISBN lookup (replace with actual API call)
    setBookDetails({
      title: "Sample Book Title",
      author: "Sample Author",
      owner: "John Doe",
      publishDate: "2022-01-01",
      tags: "Fiction, Adventure",
      condition: "New",
    });
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
                onClick={handleIsbnSearch}
                className="bg-blue-600 text-white py-2 px-4 rounded-md"
              >
                Search
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
                onChange={handleInputChange} // For <input>
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
                onChange={handleInputChange} // For <input>
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
                onChange={handleInputChange} // For <input>
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
                onChange={handleInputChange} // For <input>
                className="border rounded-md p-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <input
                type="text"
                name="tags"
                value={bookDetails.tags}
                onChange={handleInputChange} // For <input>
                className="border rounded-md p-2 w-full"
                placeholder="Enter tags (comma separated)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Condition</label>
              <select
                name="condition"
                value={bookDetails.condition}
                onChange={handleSelectChange} // For <select>
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
          className="bg-green-600 text-white py-2 px-4 rounded-md w-full"
        >
          Add Book
        </button>
      </form>
    </div>
  );
}
