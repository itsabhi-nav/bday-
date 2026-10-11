import type { Metadata } from "next";

// Admin + customer panels must never appear in Google. Girl pages are
// private surprises — also kept out of search (WhatsApp previews still work).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
