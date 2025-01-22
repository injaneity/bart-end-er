import { Book } from "../util/types";

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <div>
      <h2 className="text-xl font-bold">{book.title}</h2>
      <p className="text-md">Author: {book.author}</p>
      <p>Owner: {book.owner}</p>
      <p>Publish Date: {book.publishDate}</p>
      <p>Tags: {book.tags.join(", ")}</p>
      <p>Condition: {book.condition}</p>
    </div>
  );
};

export default BookCard;
