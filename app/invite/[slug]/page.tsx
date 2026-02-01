// app/invite/[slug]/page.tsx

import InviteClient from "./InviteClient";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    bride?: string;
    groom?: string;
    date?: string; // YYYY-MM-DD
    time?: string;
    location?: string;
    guestName?: string;
  }>;
};

function parseDate(dateStr?: string): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

export default async function InvitePage({ params, searchParams }: PageProps) {
  // Next 15: params ve searchParams Promise, önce await etmeliyiz
  const { slug } = await params;
  const sp = await searchParams;

  const bride = sp.bride ?? "Gelin";
  const groom = sp.groom ?? "Damat";
  const dateStr = sp.date;
  const time = sp.time ?? "";
  const location =
    sp.location ?? "Adres daha sonra paylaşılacaktır.";
  const guestNameParam = sp.guestName;

  const eventDate = parseDate(dateStr);

  return (
    <InviteClient
      slug={slug}
      bride={bride}
      groom={groom}
      dateStr={dateStr}
      time={time}
      location={location}
      guestName={guestNameParam}
      eventDate={eventDate}
    />
  );
}
