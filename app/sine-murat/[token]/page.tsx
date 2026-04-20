import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { davetliler } from "@/lib/davetliler";
import SineMuratDavetiye from "../_davetiye";

const SITE_URL = "https://sinemuratwedding.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const guestName = davetliler[token];
  const title = guestName
    ? `${guestName} — Sine & Murat Düğün Davetiyesi`
    : "Sine & Murat — 24 Mayıs 2026";
  const description =
    "Sine ve Murat'ın düğün davetiyesi — 24 Mayıs 2026, Vedat Dalokay Nikâh Salonu, Ankara.";

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    openGraph: {
      type: "website",
      url: `${SITE_URL}/sine-murat/${token}`,
      title,
      description,
      siteName: "Sine & Murat",
      locale: "tr_TR",
      images: [
        {
          url: "/thumbnail.jpg",
          width: 1200,
          height: 630,
          alt: "Sine & Murat Düğün Davetiyesi",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/thumbnail.jpg"],
    },
  };
}

export default async function DavetliPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const guestName = davetliler[token];
  if (!guestName) notFound();
  return <SineMuratDavetiye guestName={guestName} />;
}
