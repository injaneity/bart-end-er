'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BookPreview from "./components/bookpreview";

// Define the type for a review
interface Review {
  book: {
    id: number;
    title: string;
    owner: string;
    author: string;
    publishDate: string;
    tags: string[];
    condition: string;
  };
  description: string;
  author: string;
  repostedBy: string | null;
}

const mockBookData = [
  {
    id: 1,
    title: "The Great Gatsby",
    owner: "John Doe",
    author: "F. Scott Fitzgerald",
    publishDate: "1925-04-10",
    tags: ["Classic", "Fiction"],
    condition: "Like New",
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    owner: "Jane Smith",
    author: "Harper Lee",
    publishDate: "1960-07-11",
    tags: ["Classic", "Drama"],
    condition: "Good",
  },
];

const mockReviewData = Array.from({ length: 20 }, (_, i) => ({
  book: mockBookData[i % mockBookData.length],
  description: `This is a wonderful review for book ${i + 1}.`.repeat(3),
  author: `Reviewer ${i + 1}`,
  repostedBy: i % 3 === 0 ? `Reposter ${i}` : null,
}));

const PageComponent: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]); // Initialize with the correct type
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [expandedReviews, setExpandedReviews] = useState(new Set());
  const router = useRouter();

  useEffect(() => {
    const fetchReviews = () => {
      setLoading(true);
      setTimeout(() => {
        const newReviews = mockReviewData.slice(page * 5, (page + 1) * 5);
        setReviews((prevReviews) => [...prevReviews, ...newReviews]);
        setLoading(false);
      }, 1000);
    };

    fetchReviews();
  }, [page]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleExpand = (index: unknown) => {
    setExpandedReviews((prevExpanded) => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(index)) {
        newExpanded.delete(index);
      } else {
        newExpanded.add(index);
      }
      return newExpanded;
    });
  };

  const handleOfferExchange = (bookId: unknown) => {
    router.push(`/exchange-book/${bookId}`);
  };

  const handleRepost = (index: number) => {
    const updatedReviews = [...reviews];
    updatedReviews[index].repostedBy = "You"; // Set the current user as the reposter
    setReviews(updatedReviews);
    alert("Review reposted successfully!");
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Handle the search logic here, e.g., navigate or filter results
    console.log("Search Query:", searchQuery);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 pb-20 gap-5 font-[family-name:var(--font-geist-sans)]">
      
      <form onSubmit={handleSearch} className="flex flex-row gap-2 items-center w-2/3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="border rounded-md py-1 px-3 w-full"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-1 px-4 rounded-md hover:bg-blue-700"
          >
            Search
          </button>
        </form>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-2/3">

        
        <div className="flex flex-col gap-4">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-md p-4 shadow-sm"
            >
              <p className="text-sm">
                <strong>Review by:</strong> {review.author}
              </p>
              <p className="text-sm">
                <strong>Review:</strong>{" "}
                {expandedReviews.has(index) ? (
                  <span>{review.description}</span>
                ) : (
                  <span>
                    {review.description
                      .split(" ")
                      .slice(0, 20)
                      .join(" ")}
                    ...
                    <button
                      onClick={() => toggleExpand(index)}
                      className="text-blue-500 underline ml-1"
                    >
                      Show more
                    </button>
                  </span>
                )}
              </p>
              <div className="mt-4 grid grid-cols-3 gap-4 items-center">
                <div className="col-span-2">
                  <BookPreview book={review.book} />
                </div>
                <div className="col-span-1 flex flex-col gap-2">
                  {review.repostedBy && (
                    <p className="text-sm text-gray-600">
                      <strong>Reposted by:</strong> <br /> {review.repostedBy}
                    </p>
                  )}
                  <button
                    onClick={() => handleOfferExchange(review.book.id)}
                    className="bg-blue-600 text-white py-1 px-4 rounded-md"
                  >
                    Offer to Exchange Book
                  </button>
                  <button
                    onClick={() => handleRepost(index)}
                    className="bg-gray-600 text-white py-1 px-4 rounded-md hover:bg-gray-700"
                  >
                    Repost Review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {loading && <p>Loading more reviews...</p>}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
};

export default PageComponent;
