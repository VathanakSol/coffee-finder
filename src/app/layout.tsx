import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coffee Finder - Discover Nearby Coffee Shops",
  description: "Find the best coffee shops near your location with our interactive map. Discover local cafés, view ratings, and get directions.",
  keywords: ["coffee", "cafe", "coffee shops", "nearby", "map", "location", "coffee finder"],
  authors: [{ name: "Z.ai Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Coffee Finder",
    description: "Find the best coffee shops near your location",
    url: "https://chat.z.ai",
    siteName: "Coffee Finder",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Coffee Finder",
    description: "Find the best coffee shops near your location",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
