'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReviewCard from "./components/reviewcard";
import { Review } from "./util/types";

const PageComponent: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/getReviews");
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews);
        } else {
          console.error("Failed to fetch reviews.");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleRepost = async (index: number) => {
    const review = reviews[index];
    if (!review.id) return;

    try {
      const response = await fetch(`/api/updateReview`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewId: review.id,
          reposted: [...(review.reposted || []), "currentUserId"],
        }),
      });

      if (response.ok) {
        const updatedReviews = [...reviews];
        updatedReviews[index].reposted = [...(review.reposted || []), "You"];
        setReviews(updatedReviews);
        alert("Review reposted successfully!");
      } else {
        console.error("Failed to repost review.");
      }
    } catch (error) {
      console.error("Error reposting review:", error);
    }
  };

  const handleOfferExchange = (bookId: number) => {
    router.push(`/exchange-book/${bookId}`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-2 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 items-center w-2/3">
        <div className="flex flex-col gap-4 w-full">
          {reviews.map((review, index) => (
            <ReviewCard
              key={review.id || index}
              review={review}
              onRepost={() => handleRepost(Number(review.id))}
              onOfferExchange={() => handleOfferExchange(Number(review.book))}
            />
          ))}
        </div>
        {loading && <p>Loading more reviews...</p>}
      </main>
    </div>
  );
};

export default PageComponent;
