import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const cormorantGaramond = localFont({
  src: [
    {
      path: "../../public/font/Cormorant_Garamond/CormorantGaramond-VariableFont_wght.ttf",
      weight: "300 700",
      style: "normal",
    },
    {
      path: "../../public/font/Cormorant_Garamond/CormorantGaramond-Italic-VariableFont_wght.ttf",
      weight: "300 700",
      style: "italic",
    },
  ],
  variable: "--font-cormorant-garamond",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Peter Frederick Rhodes Memorial - In Loving Memory",
  description: "A place to remember, share, and celebrate Peter's life. Share your memories and tributes to honor Peter Frederick Rhodes (1948-2025).",
  icons: {
    icon: '/candle.svg?v=1',
    shortcut: '/candle.svg?v=1',
    apple: '/candle.svg?v=1',
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
        className={`${cormorantGaramond.variable} font-serif antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
