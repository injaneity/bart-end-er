'use client';

import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

interface Book {
  id: string;
  title: string;
  condition: string;
  owner: string;
}

interface Review {
  id: string;
  book: string;
  text: string;
}

interface ExchangeOffer {
  id: string;
  book: string;
  owner: string;
}

export default function Profile() {
  const [books, setBooks] = useState<Book[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pendingOffers, setPendingOffers] = useState<ExchangeOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  // Fetch books, reviews, and pending offers on load
  useEffect(() => {
    if (!user?.username) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch user's books
        const booksResponse = await fetch(`/api/getBookByOwner?owner=${user.username}`);
        if (booksResponse.ok) {
          const booksData = await booksResponse.json();
          setBooks(booksData.books || []);
        } else {
          console.error("Failed to fetch books.");
        }

        // Fetch user's reviews
        const reviewsResponse = await fetch(`/api/getReviewByWriter?writer=${user.username}`);
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData.reviews || []);
        } else {
          console.error("Failed to fetch reviews.");
        }

        // Fetch pending exchange offers
        const offersResponse = await fetch(`/api/getExchangeOffers?owner=${user.username}`);
        if (offersResponse.ok) {
          const offersData = await offersResponse.json();
          setPendingOffers(offersData.offers || []);
        } else {
          console.error("Failed to fetch exchange offers.");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.username]);

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/deleteReview`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId }),
      });

      if (response.ok) {
        setReviews((prev) => prev.filter((review) => review.id !== reviewId));
        alert("Review deleted successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      {loading ? (
        <p>Loading your data...</p>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Books</h2>
            <ul className="space-y-2">
              {books.length > 0 ? (
                books.map((book) => (
                  <li key={book.id} className="border rounded-md p-4 shadow-sm">
                    <p>
                      <strong>Title:</strong> {book.title}
                    </p>
                    <p>
                      <strong>Owner:</strong> {book.owner}
                    </p>
                    <p>
                      <strong>Condition:</strong> {book.condition}
                    </p>
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-600">No books found.</p>
              )}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Reviews</h2>
            <ul className="space-y-2">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <li key={review.id} className="border rounded-md p-4 shadow-sm flex justify-between items-start">
                    <div>
                      <p>
                        <strong>Book:</strong> {review.book}
                      </p>
                      <p>
                        <strong>Review:</strong> {review.text}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-600">No reviews found.</p>
              )}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Pending Book Exchange Offers</h2>
            <ul className="space-y-2">
              {pendingOffers.length > 0 ? (
                pendingOffers.map((offer) => (
                  <li key={offer.id} className="border rounded-md p-4 shadow-sm">
                    <p>
                      <strong>Book:</strong> {offer.book}
                    </p>
                    <p>
                      <strong>Owner:</strong> {offer.owner}
                    </p>
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-600">No pending exchange offers.</p>
              )}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
