import "./globals.css";
import {
  Great_Vibes,
  Cormorant_Garamond,
  Roboto,
  Pacifico,
  Sofia,
  Cookie,
  Dancing_Script,
  Parisienne,
  Lugrasimo,
  Italianno,
  Charm,
  Playfair_Display,
} from "next/font/google";

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

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

const lugrasimo = Lugrasimo({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-lugrasimo",
});
const italianno = Italianno({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-italianno",
});
const charm = Charm({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-charm",
});

// Diğer fontları da burada tanımlıyoruz (davetiye için kullanacağız)
const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
});

const sofia = Sofia({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sofia",
});

const cookie = Cookie({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cookie",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing-script",
});

const parisienne = Parisienne({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-parisienne",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>{/* style.css artık yok */}</head>
      <body
        className={[
          greatVibes.variable,
          cormorant.variable,
          roboto.variable,
          pacifico.variable,
          sofia.variable,
          cookie.variable,
          dancingScript.variable,
          parisienne.variable,
          playfair.variable,
          lugrasimo.variable,
          italianno.variable,
          charm.variable,
        ].join(" ")}
      >
        {children}
      </body>
    </html>
  );
}
