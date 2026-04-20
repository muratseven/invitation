import type { Metadata } from "next";
import { PartyRedirect } from "./PartyRedirect";

const SITE_URL = "https://sinemuratwedding.com";
const PDF_PATH = "/Sine-Murat-Wedding-Party-Invitation.pdf";
const TITLE = "Sine & Murat Wedding Party";
const DESCRIPTION = "24 Mayıs 2026 | Detaylar için tıklayın";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: `${SITE_URL}/party-invitation`,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Sine & Murat",
    locale: "tr_TR",
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
        alt: TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/thumbnail.png"],
  },
  other: {
    "refresh": `0;url=${PDF_PATH}`,
  },
};

export default function PartyInvitationPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
        background: "#f5e8dd",
        color: "#6b0f18",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <PartyRedirect pdfPath={PDF_PATH} />
      <div>
        <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
          Davetiye yükleniyor…
        </p>
        <a
          href={PDF_PATH}
          style={{
            color: "#6b0f18",
            textDecoration: "underline",
            fontSize: "0.95rem",
          }}
        >
          Otomatik açılmazsa buraya tıklayın
        </a>
      </div>
    </div>
  );
}
