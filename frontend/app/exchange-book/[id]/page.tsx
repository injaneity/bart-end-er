'use client';

import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

interface PageProps {
  params: Promise<{ id?: string }>;
}

interface Book {
  id: number;
  title: string;
  condition: string;
}

interface ExchangeOffer {
  owner1: string; // Initiator's username
  book1: string; // Book to be exchanged
  owner2: string; // Book owner's username
  book2: string; // Book to exchange with
}

const OfferExchange: React.FC<PageProps> = ({ params }) => {
  const [bookToExchange, setBookToExchange] = useState<string>("Unknown Book");
  const [userBooks, setUserBooks] = useState<Book[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string>(""); // Use string for dropdown compatibility
  const [loading, setLoading] = useState(false);
  const { user } = useUser(); // Get the logged-in user

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setBookToExchange(resolvedParams.id || "Unknown Book");
    };

    fetchParams();
  }, [params]);

  // Fetch books owned by the user
  useEffect(() => {
    const fetchUserBooks = async () => {
      if (!user?.username) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/getBookByOwner?owner=${user.username}`);
        if (response.ok) {
          const data = await response.json();
          setUserBooks(data.books || []);
        } else {
          console.error("Failed to fetch user books.");
        }
      } catch (error) {
        console.error("Error fetching user books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBooks();
  }, [user?.username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId) {
      alert("Please select a book to offer.");
      return;
    }

    const exchangeOffer: ExchangeOffer = {
      owner1: user?.username || "Unknown", // Initiator
      book1: bookToExchange, // Book to exchange
      owner2: "UnknownOwner", // Replace with the actual owner of the book to exchange
      book2: selectedBookId, // Selected book to exchange with
    };

    try {
      const response = await fetch("/api/addExchangeOffer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exchangeOffer),
      });

      if (response.ok) {
        alert("Exchange offer submitted successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error submitting exchange offer:", error);
      alert("Failed to submit the exchange offer.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-xl font-bold mb-6">Offer Exchange</h1>
      <p className="mb-4">
        You are offering a book in exchange for: <strong>{bookToExchange}</strong>
      </p>
      {loading ? (
        <p>Loading your books...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Select a Book to Offer
            </label>
            {userBooks.length > 0 ? (
              <select
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                className="border rounded-md p-2 w-full"
                required
              >
                <option value="" disabled>
                  -- Select a book --
                </option>
                {userBooks.map((book) => (
                  <option key={book.id} value={book.title}>
                    {book.title} ({book.condition})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-gray-600">No books found in your account.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!selectedBookId || loading}
            className="bg-blue-600 text-white py-2 px-4 rounded-md w-full hover:bg-blue-700 disabled:bg-gray-400"
          >
            Submit Offer
          </button>
        </form>
      )}
    </div>
  );
};

export default OfferExchange;
