'use client';

import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Book } from "../util/types";

export default function AddReview() {
  const [books, setBooks] = useState<Book[]>([]); // Typed as Book[]
  const [selectedBook, setSelectedBook] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser(); // Get the logged-in user

  // Fetch books by the logged-in user
  useEffect(() => {
    const fetchBooks = async () => {
      if (!user?.username) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/getBookByOwner?owner=${user.username}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched books:", data.books); // Debugging line

          // Optional: Validate and process books
          const processedBooks: Book[] = data.books.filter((book: Book) => {
            if (book.id === undefined || book.id === null) {
              console.warn(`Book titled "${book.title}" is missing an id and will be skipped.`);
              return false; // Exclude books without valid id
            }
            return true;
          });

          setBooks(processedBooks);
        } else {
          console.error("Failed to fetch books.");
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [user?.username]);

  const handleBookSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bookId = parseInt(e.target.value, 10);
    setSelectedBook(bookId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (selectedBook === null || !reviewText.trim()) {
          alert("Please select a book and write a review.");
          return;
      }

      setLoading(true);

      const payload = {
        book: selectedBook.toString(), // Send the selected book ID
        text: reviewText,
        writer: user?.username, // Use the logged-in user's username
        reposted: [], // Include reposted as an empty array
      };
      console.log(payload);

      try {
          const response = await fetch("/api/addReview", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
          });

          if (response.ok) {
              alert("Review added successfully!");
              setReviewText(""); // Clear the form after submission
              setSelectedBook(null); // Reset the selected book
          } else {
              const error = await response.json();
              alert(`Error: ${error.message}`);
          }
      } catch (error) {
          console.error("Error submitting review:", error);
          alert("Failed to add the review.");
      } finally {
          setLoading(false);
      }
  };


  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Add a Review</h1>
      {loading ? (
        <p>Loading your books...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="book-select">
              Select a Book
            </label>
            <select
              id="book-select"
              value={selectedBook !== null ? selectedBook : ""}
              onChange={handleBookSelection}
              className="border rounded-md p-2 w-full"
              required
            >
              <option value="" disabled>
                -- Select a book --
              </option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="review-text">
              Your Review
            </label>
            <textarea
              id="review-text"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="border rounded-md p-2 w-full h-32"
              placeholder="Write your review here..."
              required
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded-md w-full"
            disabled={books.length === 0 || loading}
          >
            Submit Review
          </button>
        </form>
      )}
    </div>
  );
}
