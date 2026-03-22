import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { productId, orderId, rating, review } = await req.json();

        const user = await prisma.user.findFirst({
            where: { email: session.user.email }
        });

        // Check kar ki order is user ka hai aur delivered hai
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                userId: user.id,
                status: "DELIVERED"
            }
        });

        if (!order) {
            return NextResponse.json({ success: false, message: "Order not found or not delivered" }, { status: 404 });
        }

        // Upsert — agar pehle se rating hai toh update, warna create
        const newRating = await prisma.rating.upsert({
            where: {
                userId_productId_orderId: {
                    userId: user.id,
                    productId,
                    orderId
                }
            },
            update: { rating, review },
            create: { userId: user.id, productId, orderId, rating, review }
        });

        return NextResponse.json({ success: true, rating: newRating });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}