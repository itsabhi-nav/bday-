import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { hashPassword, DEFAULT_CUSTOMER_PASSWORD } from "@/lib/auth";
import { getStore } from "@/lib/db";
import { defaultSiteData, slugify } from "@/lib/sitedata";

/**
 * POST { razorpay_payment_id, razorpay_order_id, razorpay_signature, username, girlName, password? }
 * → verifies HMAC-SHA256 signature, then auto-creates the customer account.
 * Returns login credentials + page link so the buyer can start immediately.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    razorpay_payment_id?: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
    username?: string;
    girlName?: string;
    password?: string;
  };
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;
  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 });
  }

  // HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
  const expected = createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(razorpay_signature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    // signature mismatch → NEVER mark as paid
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  // payment verified → create the account
  const username = (body.username || "").trim().toLowerCase().replace(/[^a-z0-9-_]/g, "");
  const girlName = (body.girlName || "").trim() || "Someone Special";
  const password = body.password || DEFAULT_CUSTOMER_PASSWORD;
  if (!username) return NextResponse.json({ error: "Username required" }, { status: 400 });
  if (password.length < 4) return NextResponse.json({ error: "Password must be 4+ characters" }, { status: 400 });

  const slug = slugify(girlName) || username;
  const now = new Date().toISOString();
  const data = defaultSiteData(slug, girlName);
  try {
    await getStore().createCustomer(
      { username, passHash: await hashPassword(password), slug, createdAt: now, expiresAt: null },
      { slug, username, data, createdAt: now, expiresAt: null, updatedAt: now }
    );
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    username,
    password,
    slug,
    loginUrl: "/admin",
    pageUrl: `/${slug}`,
  });
}
