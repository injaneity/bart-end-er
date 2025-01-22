import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import Navbar from "./components/navbar";

export const metadata: Metadata = {
  title: "Bartender",
  description: "Peer to peer book exchange platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Navbar/>
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
