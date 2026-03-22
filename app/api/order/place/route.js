import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { items, addressId, paymentMethod, coupon, total } = await request.json();

        const user = await prisma.user.findFirst({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const storeMap = {}
        for (const item of items) {
            if (!storeMap[item.storeId]) {
                storeMap[item.storeId] = []
            }
            storeMap[item.storeId].push(item)
        }

        const orders = []
        for (const [storeId, storeItems] of Object.entries(storeMap)) {
            const storeTotal = storeItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
            const order = await prisma.order.create({
                data: {
                    total: storeTotal,
                    userId: user.id,
                    storeId,
                    addressId,
                    paymentMethod,
                    isCouponUsed: !!coupon,
                    coupon: coupon || {},
                    orderItems: {
                        create: storeItems.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price
                        }))
                    }
                }
            })
            orders.push(order)
        }

        return NextResponse.json({ success: true, orders });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}