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

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const orders = await prisma.order.findMany({
            where: { userId: user.id },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                },
                address: true,
                store: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ success: true, orders });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// Cancel order — sirf ORDER_PLACED wale
export async function PATCH(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { orderId } = await req.json();

        const user = await prisma.user.findFirst({
            where: { email: session.user.email }
        });

        const order = await prisma.order.findFirst({
            where: { id: orderId, userId: user.id }
        });

        if (!order) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
        }

        if (order.status !== "ORDER_PLACED") {
            return NextResponse.json({ success: false, message: "Only ORDER_PLACED orders can be cancelled" }, { status: 400 });
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status: "CANCELLED" }
        });

        return NextResponse.json({ success: true, order: updatedOrder });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// Delete order — history se permanently hatao
export async function DELETE(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { orderId } = await req.json();

        const user = await prisma.user.findFirst({
            where: { email: session.user.email }
        });

        const order = await prisma.order.findFirst({
            where: { id: orderId, userId: user.id }
        });

        if (!order) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
        }

        await prisma.order.delete({
            where: { id: orderId }
        });

        return NextResponse.json({ success: true, message: "Order deleted" });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}