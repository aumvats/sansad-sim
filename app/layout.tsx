import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SansadSim — See how India legislates",
  description:
    "Interactive Indian Parliament simulator. Type a bill, watch it move through Lok Sabha, Rajya Sabha, Presidential Assent, and Supreme Court review with real MP profiles.",
  openGraph: {
    title: "SansadSim — See how India legislates",
    description:
      "Interactive Indian Parliament simulator with 788 real MP profiles.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${sourceSerif.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
