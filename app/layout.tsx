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
  title: "Test Your Gaydar",
  description: "A voice perception experiment. Can you tell if someone is gay or straight from their voice?",
  openGraph: {
    title: "Test Your Gaydar",
    description: "A voice perception experiment. Can you tell if someone is gay or straight from their voice?",
    images: [{ url: "/gaydar_radar_in_rainbow_pride_colors.webp" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Test Your Gaydar",
    description: "A voice perception experiment. Can you tell if someone is gay or straight from their voice?",
    images: ["/gaydar_radar_in_rainbow_pride_colors.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
