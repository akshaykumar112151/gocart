import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findFirst({
            where: { email: session.user.email }
        });

        const store = await prisma.store.findUnique({
            where: { userId: user.id }
        });

        if (!store) {
            return NextResponse.json({ success: false, message: "Store not found" }, { status: 404 });
        }

        const totalProducts = await prisma.product.count({
            where: { storeId: store.id }
        });

        const orders = await prisma.order.findMany({
            where: { storeId: store.id },
            orderBy: { createdAt: 'asc' }
        });

        const totalEarnings = orders.reduce((acc, order) => acc + order.total, 0);

        const ratings = await prisma.rating.findMany({
            where: { product: { storeId: store.id } },
            include: {
                user: true,
                product: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            success: true,
            dashboardData: {
                totalProducts,
                totalEarnings,
                totalOrders: orders.length,
                ratings,
                orders  // ← chart ke liye
            }
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}