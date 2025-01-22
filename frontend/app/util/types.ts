// types.ts
export interface Book {
    id: string;
    title: string;
    owner: string;
    author: string;
    publishDate: string;
    tags: string[];
    isbn?: string;
    condition: string;
  }

export interface Review {
    id: string;
    writer: string; // Writer of the review
    book: string;   // Book ID
    text: string;   // Review text
    reposted: string[]; // Array of user IDs who reposted the review
  }
  