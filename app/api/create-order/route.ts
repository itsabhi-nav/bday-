import { NextResponse } from "next/server";
import Razorpay from "razorpay";

/**
 * POST { plan: "classic" | "deluxe" }
 * → creates a Razorpay order, returns what the checkout modal needs.
 * Amounts in paise: ₹499 / ₹999.
 */
export async function POST(req: Request) {
  const { plan } = (await req.json().catch(() => ({}))) as { plan?: string };
  const amount = plan === "deluxe" ? 99900 : plan === "classic" ? 49900 : 0;
  if (!amount || amount < 100) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }
  const planName = plan === "deluxe" ? "deluxe" : "classic";

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 });
  }

  try {
    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = (await rzp.orders.create({
      amount,
      currency: "INR",
      receipt: `order-${Date.now()}`,
      notes: { plan: planName },
    })) as unknown as { id: string; amount: number; currency?: string };
    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || keyId,
    });
  } catch (e) {
    return NextResponse.json({ error: "Could not create payment" }, { status: 500 });
  }
}
