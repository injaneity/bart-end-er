'use client';

import React, { useState } from "react";
import { Review } from "../util/types";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useUser } from "@clerk/clerk-react";

type ReviewCardProps = {

    review: Review;
    onRepost: () => Promise<void>;
    onOfferExchange: () => void;
  
  };

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onOfferExchange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useUser(); // Get the logged-in user

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleRepost = async () => {
    if (!review.id || !user?.id) {
      alert("Cannot repost. User or review is missing.");
      return;
    }

    try {
      const response = await fetch(`/api/updateReview`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: review.id,
          reposted: [...review.reposted, user.id], // Add the current user's ID to the reposted list
        }),
      });

      if (response.ok) {
        alert("Review reposted successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error reposting review:", error);
      alert("Failed to repost the review.");
    }
  };

  return (
    <Card>
      <div className="rounded-md p-6 shadow-sm w-full flex flex-col gap-4">
        {/* Review Header */}
        <div className="flex flex-col">
          <p className="text-lg">
            <strong>Review by:</strong> {review.writer}
          </p>
          <p className="text-lg">
            <strong>Review:</strong>{" "}
            {isExpanded ? (
              <span>{review.text || "No description available."}</span>
            ) : (
              <span>
                {(review.text || "No description available.")
                  .split(" ")
                  .slice(0, 20)
                  .join(" ")}
                ...
                <button
                  onClick={toggleExpand}
                  className="text-blue-900 underline ml-1"
                >
                  Show more
                </button>
              </span>
            )}
          </p>
        </div>

        {/* Buttons Section */}
        <div className="flex items-start gap-4">
          {/* Buttons aligned to the right */}
          <div className="flex flex-col gap-2">
            <Button
              variant="neutral"
              onClick={handleRepost}
              className="text-black py-2 px-4 rounded-md"
            >
              Repost Review
            </Button>

            <Button
              onClick={onOfferExchange}
              className="bg-gray-800 text-white py-2 px-4 rounded-md"
            >
              Offer Exchange
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ReviewCard;
