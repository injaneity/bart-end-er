'use client';

import { useState, useEffect } from "react";

interface PageProps {
  params: Promise<{ id?: string }>;
}

const OfferExchange: React.FC<PageProps> = ({ params }) => {
  const [book, setBook] = useState<string | undefined>(undefined);
  const [selectedBookId, setSelectedBookId] = useState(""); // Default to an empty string

  useEffect(() => {
    params.then((resolvedParams) => {
      setBook(resolvedParams.id);
    });
  }, [params]);

  const bookToExchange = book || "Unknown Book"; // Get the book to exchange from params

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const offeredBook = mockUserBooks.find((book) => book.id === Number(selectedBookId));
    console.log("Exchange Offer Submitted:", {
      bookToExchange,
      offeredBook,
    });
    alert(`Exchange offer submitted for ${bookToExchange} with ${offeredBook?.title}`);
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-xl font-bold mb-6">Offer Exchange</h1>
      <p className="mb-4">
        You are offering a book in exchange for: <strong>{bookToExchange}</strong>
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Select a Book to Offer</label>
          <select
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value)}
            className="border rounded-md p-2 w-full"
          >
            <option value="">Select a book</option>
            {mockUserBooks.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} ({book.condition})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={!selectedBookId}
          className="bg-blue-600 text-white py-2 px-4 rounded-md w-full hover:bg-blue-700 disabled:bg-gray-400"
        >
          Submit Offer
        </button>
      </form>
    </div>
  );
};

export default OfferExchange;

const mockUserBooks = [
  {
    id: 1,
    title: "The Catcher in the Rye",
    condition: "Good",
  },
  {
    id: 2,
    title: "The Hobbit",
    condition: "Like New",
  },
  {
    id: 3,
    title: "Brave New World",
    condition: "Fair",
  },
];
