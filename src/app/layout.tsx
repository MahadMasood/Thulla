import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Card Game Leaderboard",
  description: "Keep track of game losses and see who is at the bottom!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
