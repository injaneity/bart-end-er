/* eslint-disable @next/next/no-img-element */
'use client'
import Link from "next/link";
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

export default function Navbar() {
    

    return (
      <header className="w-full py-4 px-8 shadow-md flex justify-between items-center">
        <Link href="/">
          <img src="/digital-library.png" alt="Logo" className="h-8 cursor-pointer" />
        </Link>

        <div className="flex flex-row gap-4">
          <Link href="/add-book">
            <Button className="py-2 px-4">
              Add Book
            </Button>
          </Link>
          <Link href="/add-review">
            <Button className="py-2 px-4">
              Add Review
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="neutral" className="text-black">
              Profile
            </Button>
          </Link>
          <SignedOut>
              <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton/>
          </SignedIn>
        </div>
      </header>
    );
}
