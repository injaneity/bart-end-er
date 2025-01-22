// pages/addreview.tsx
'use client';

import { useState } from "react";

const mockBookData = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
  },
];

export default function AddReview() {
  const [selectedBook, setSelectedBook] = useState(mockBookData[0].id);
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Review submitted:", {
      book: mockBookData.find((book) => book.id === selectedBook),
      review: reviewText,
    });
    alert("Review added successfully!");
    setReviewText(""); // Clear the form after submission
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Add a Review</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Select Book</label>
          <select
            value={selectedBook}
            onChange={(e) => setSelectedBook(Number(e.target.value))}
            className="border rounded-md p-2 w-full"
          >
            {mockBookData.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} by {book.author}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Your Review</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="border rounded-md p-2 w-full h-32"
            placeholder="Write your review here..."
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded-md w-full"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}
