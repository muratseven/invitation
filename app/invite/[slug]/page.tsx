// app/invite/[slug]/page.tsx
import InviteClient from "./InviteClient";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ d?: string }>;
};

export default async function InvitePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  return <InviteClient slug={slug} encodedData={sp.d} />;
}
