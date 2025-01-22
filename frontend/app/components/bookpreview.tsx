import { Book } from "../util/types";
import { useState } from "react";
import BookCard from "./bookcard";

interface BookPreviewProps {
  book: Book;
}

const BookPreview: React.FC<BookPreviewProps> = ({ book }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="border border-gray-300 rounded-md p-4 shadow-sm">
      <p className="text-lg font-semibold">{book.title}</p>
      <p className="text-sm text-gray-600">by {book.author}</p>
      <button
        onClick={openDialog}
        className="mt-2 bg-blue-600 text-white py-1 px-4 rounded-md"
      >
        View Details
      </button>
      {isDialogOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
            <BookCard book={book} />
            <button
              onClick={closeDialog}
              className="mt-4 bg-red-600 text-white py-1 px-4 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookPreview;
