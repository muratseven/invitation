import { notFound } from "next/navigation";
import { davetliler } from "@/lib/davetliler";
import SineMuratDavetiye from "../_davetiye";

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
