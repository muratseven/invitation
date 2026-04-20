import type { Metadata } from "next";
import SineMuratDavetiye from "./sine-murat/_davetiye";

const SITE_URL = "https://sinemuratwedding.com";
const TITLE = "Sine & Murat — 24 Mayıs 2026";
const DESCRIPTION =
  "Sine ve Murat'ın düğün davetiyesi — 24 Mayıs 2026, Vedat Dalokay Nikâh Salonu, Ankara.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Sine & Murat",
    locale: "tr_TR",
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "Sine & Murat Düğün Davetiyesi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/thumbnail.png"],
  },
};

export default function HomePage() {
  return <SineMuratDavetiye />;
}
