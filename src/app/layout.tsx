import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GameSync - AI-Powered Game Update Tracker",
  description: "Stay synchronized with your favorite games! Get AI-powered summaries of all updates, patches, and release notes since you last played. Never miss important changes in CS2, League of Legends, Overwatch 2, and more.",
  keywords: "game updates, patch notes, release notes, gaming, AI summary, game tracker, CS2, League of Legends, Overwatch",
  authors: [{ name: "GameSync Team" }],
  openGraph: {
    title: "GameSync - Never Miss a Game Update Again",
    description: "AI-powered game update summaries for CS2, LoL, Overwatch 2 and more",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
