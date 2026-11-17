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
  metadataBase: new URL("https://gregrickaby.github.io"),
  title: "Next.js GitHub Pages",
  description:
    "Deploy a Next.js app to GitHub Pages via GitHub Actions. A minimal, working template with static exports, base path, and a Pages deploy workflow.",
  openGraph: {
    title: "Next.js GitHub Pages",
    description:
      "Deploy a Next.js app to GitHub Pages via GitHub Actions. A minimal, working template with static exports, base path, and a Pages deploy workflow.",
    type: "website",
    url: "https://gregrickaby.github.io/nextjs-github-pages/",
    images: [
      {
        url: "/nextjs-github-pages/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Next.js GitHub Pages — deploy a Next.js app to GitHub Pages via GitHub Actions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Next.js GitHub Pages",
    description:
      "Deploy a Next.js app to GitHub Pages via GitHub Actions. A minimal, working template with static exports, base path, and a Pages deploy workflow.",
    images: ["/nextjs-github-pages/social-preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
