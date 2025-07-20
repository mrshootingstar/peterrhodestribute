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
    icon: [
      {
        url: '/candle.svg',
        type: 'image/svg+xml',
        sizes: '16x16'
      },
      {
        url: '/candle.svg',
        type: 'image/svg+xml',
        sizes: '32x32'
      }
    ],
    shortcut: {
      url: '/candle.svg',
      type: 'image/svg+xml'
    },
    apple: {
      url: '/candle.svg',
      type: 'image/svg+xml'
    }
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
