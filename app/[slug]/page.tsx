import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Journey from "@/components/Journey";
import { getStore } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Private surprise pages stay out of Google — but WhatsApp previews still shine. */
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const site = await getStore().getSite(params.slug);
    if (site) {
      return {
        title: `For ${site.data.girlfriendName} ♥`,
        description: "Someone made you a little surprise. Open it.",
        robots: { index: false, follow: false },
      };
    }
  } catch {
    /* fall through to default */
  }
  return { robots: { index: false, follow: false } };
}

function Expired({ name }: { name: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6 text-center text-cocoa">
      <div className="max-w-sm border border-cocoa/15 bg-[#FFFDF7] p-10 shadow-photo">
        <p className="font-hand text-4xl text-cherry">oh no…</p>
        <h1 className="font-display mt-3 text-3xl font-semibold">This surprise has expired</h1>
        <p className="mt-3 text-sm font-medium text-cocoasoft">
          {name}&apos;s page is taking a little nap. Ask the gift-giver to extend it ♥
        </p>
      </div>
    </main>
  );
}

/** A customer's private birthday page: yourdomain.com/her-name */
export default async function GirlPage({ params }: { params: { slug: string } }) {
  const site = await getStore().getSite(params.slug);
  if (!site) notFound();
  if (site.expiresAt && new Date(site.expiresAt).getTime() < Date.now()) {
    return <Expired name={site.data.girlfriendName} />;
  }
  return <Journey data={site.data} />;
}
