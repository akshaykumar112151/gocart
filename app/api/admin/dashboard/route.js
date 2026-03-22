import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.email !== ADMIN_EMAIL) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const products = await prisma.product.count();
        const stores = await prisma.store.count({ where: { isActive: true } });
        const allOrders = await prisma.order.findMany({
            orderBy: { createdAt: 'asc' }
        });

        const revenue = allOrders.reduce((acc, order) => acc + order.total, 0);

        return NextResponse.json({
            success: true,
            dashboardData: {
                products,
                revenue,
                orders: allOrders.length,
                stores,
                allOrders
            }
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}