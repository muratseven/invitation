// app/layout.tsx

import "./globals.css";
import { Great_Vibes, Cormorant_Garamond } from "next/font/google";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        {/* static style.css for invitation UI */}
        <link rel="stylesheet" href="./style.css" />
      </head>
      <body className={`${greatVibes.variable} ${cormorant.variable}`}>
        {children}
      </body>
    </html>
  );
}
