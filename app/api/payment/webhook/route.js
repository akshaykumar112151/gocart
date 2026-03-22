import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    let event;
    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error("Webhook error:", err.message);
        return NextResponse.json({ error: err.message }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const { userId, addressId, coupon, total, items } = session.metadata;

        try {
            const user = await prisma.user.findFirst({
                where: { email: userId }
            });

            const parsedItems = JSON.parse(items);
            const parsedCoupon = coupon ? JSON.parse(coupon) : null;

            // Har store ke liye alag order banao
            const storeGroups = parsedItems.reduce((acc, item) => {
                if (!acc[item.storeId]) acc[item.storeId] = [];
                acc[item.storeId].push(item);
                return acc;
            }, {});

            for (const [storeId, storeItems] of Object.entries(storeGroups)) {
                const storeTotal = storeItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

                await prisma.order.create({
                    data: {
                        userId: user.id,
                        storeId,
                        addressId,
                        paymentMethod: "STRIPE",
                        isPaid: true,
                        isCouponUsed: !!parsedCoupon,
                        coupon: parsedCoupon || {},
                        total: storeTotal,
                        orderItems: {
                            create: storeItems.map(item => ({
                                productId: item.productId,
                                quantity: item.quantity,
                                price: item.price
                            }))
                        }
                    }
                });
            }
        } catch (err) {
            console.error("Order create error:", err);
        }
    }

    return NextResponse.json({ received: true });
}