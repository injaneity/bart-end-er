/* eslint-disable @next/next/no-img-element */
'use client'
import Link from "next/link";
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";

export default function Navbar() {
    

    return (
      <header className="w-full py-4 px-8 shadow-md flex justify-between items-center">
        <Link href="/">
          <img src="/placeholder-logo.png" alt="Logo" className="h-8 cursor-pointer" />
        </Link>

        <div className="flex flex-row gap-4">
          <Link href="/add-book">
            <button className="bg-blue-600 text-white py-2 px-4 rounded-md">Add Book</button>
          </Link>
          <Link href="/add-review">
            <button className="bg-blue-600 text-white py-2 px-4 rounded-md">Add Review</button>
          </Link>
          <Link href="/profile">
            <button className="bg-blue-600 text-white py-2 px-4 rounded-md">Profile</button>
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
