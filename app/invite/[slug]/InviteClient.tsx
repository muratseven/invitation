// app/invite/[slug]/InviteClient.tsx

"use client";

import React from "react";

type InviteClientProps = {
  slug: string;
  bride: string;
  groom: string;
  dateStr?: string;
  time: string;
  location: string;
  guestName?: string;
  eventDate: Date | null;
};

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
};

function computeCountdown(eventDate: Date | null): Countdown {
  if (!eventDate) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: false };
  }

  const now = new Date().getTime();
  const diff = eventDate.getTime() - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, finished: false };
}

export default function InviteClient({
  slug,
  bride,
  groom,
  dateStr,
  time,
  location,
  guestName,
  eventDate,
}: InviteClientProps) {
  const [countdown, setCountdown] = React.useState<Countdown>(
    computeCountdown(eventDate)
  );

  React.useEffect(() => {
    setCountdown(computeCountdown(eventDate));
    const id = setInterval(() => {
      setCountdown(computeCountdown(eventDate));
    }, 1000);
    return () => clearInterval(id);
  }, [eventDate]);

  const dateText = eventDate
    ? eventDate.toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      })
    : "";

  const displayGuestName = guestName || slug.replace(/-/g, " ");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
      <main className="w-full max-w-2xl bg-[#f7f3ef] text-black rounded-3xl shadow-2xl overflow-hidden">
        <section className="px-6 py-8 text-center border-b border-black/10">
          <p className="tracking-[0.3em] text-[0.65rem] uppercase mb-3">
            Davet
          </p>
          <h1 className="text-3xl font-light mb-2">
            {bride} &amp; {groom}
          </h1>

          {/* Sayaç */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs">
            {eventDate ? (
              countdown.finished ? (
                <span className="px-4 py-2 rounded-full bg-black/10">
                  Etkinlik zamanı geldi 🎉
                </span>
              ) : (
                <>
                  <CountdownBadge label="Gün" value={countdown.days} />
                  <CountdownBadge label="Saat" value={countdown.hours} />
                  <CountdownBadge label="Dakika" value={countdown.minutes} />
                  <CountdownBadge label="Saniye" value={countdown.seconds} />
                </>
              )
            ) : (
              <span className="px-4 py-2 rounded-full bg-black/10 text-[0.7rem]">
                Tarih bilgisi gelmedi
              </span>
            )}
          </div>

          {dateText && (
            <div className="mt-3 text-xs opacity-80">
              <p>{dateText}</p>
              {time && <p className="mt-0.5">{time}</p>}
            </div>
          )}

          <p className="mt-4 text-xs text-slate-600 italic">
            Sevgili <span className="font-semibold">{displayGuestName}</span>,
            bu özel günümüzde seni de aramızda görmek isteriz.
          </p>
        </section>

        <section className="px-6 py-8 text-center">
          <h2 className="text-lg font-medium mb-3">Konum</h2>
          <p className="text-sm whitespace-pre-line mb-4">{location}</p>
        </section>
      </main>
    </div>
  );
}

function CountdownBadge({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-[64px] px-3 py-2 rounded-xl bg-black/10 text-center">
      <div className="text-sm font-semibold">{value}</div>
      <div className="text-[0.65rem] mt-0.5 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}
