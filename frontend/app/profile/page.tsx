// pages/profile.tsx
'use client';

const mockBooks = [
  {
    title: "The Great Gatsby",
    owner: "John Doe",
    condition: "Like New",
  },
  {
    title: "To Kill a Mockingbird",
    owner: "Jane Smith",
    condition: "Good",
  },
];

const mockReviews = [
  {
    bookTitle: "1984",
    review: "A gripping tale of a dystopian future!",
  },
  {
    bookTitle: "Pride and Prejudice",
    review: "A beautiful exploration of love and society.",
  },
];

const mockPendingOffers = [
  {
    book: "Moby Dick",
    owner: "Alice Johnson",
  },
  {
    book: "War and Peace",
    owner: "Bob Brown",
  },
];

export default function Profile() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Books</h2>
        <ul className="space-y-2">
          {mockBooks.map((book, index) => (
            <li key={index} className="border rounded-md p-4 shadow-sm">
              <p><strong>Title:</strong> {book.title}</p>
              <p><strong>Owner:</strong> {book.owner}</p>
              <p><strong>Condition:</strong> {book.condition}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Reviews</h2>
        <ul className="space-y-2">
          {mockReviews.map((review, index) => (
            <li key={index} className="border rounded-md p-4 shadow-sm">
              <p><strong>Book:</strong> {review.bookTitle}</p>
              <p><strong>Review:</strong> {review.review}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Pending Book Exchange Offers</h2>
        <ul className="space-y-2">
          {mockPendingOffers.map((offer, index) => (
            <li key={index} className="border rounded-md p-4 shadow-sm">
              <p><strong>Book:</strong> {offer.book}</p>
              <p><strong>Owner:</strong> {offer.owner}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
