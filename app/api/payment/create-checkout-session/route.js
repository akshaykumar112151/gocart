import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { items, addressId, coupon, total } = await req.json();

        const lineItems = items.map(item => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                    images: [item.image],
                },
                unit_amount: Math.round(item.price * 100), // cents mein
            },
            quantity: item.quantity,
        }));

        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.NEXTAUTH_URL}/orders?success=true`,
            cancel_url: `${process.env.NEXTAUTH_URL}/cart?cancelled=true`,
            metadata: {
                userId: session.user.email,
                addressId,
                coupon: coupon ? JSON.stringify(coupon) : "",
                total: total.toString(),
                items: JSON.stringify(items)
            }
        });

        return NextResponse.json({ success: true, url: stripeSession.url });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}