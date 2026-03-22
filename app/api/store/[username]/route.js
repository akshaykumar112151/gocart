import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
    try {
        const { username } = await params;

        const store = await prisma.store.findUnique({
            where: { username },
        });

        if (!store) {
            return NextResponse.json({ success: false, message: "Store not found" }, { status: 404 });
        }

        const products = await prisma.product.findMany({
            where: { storeId: store.id },
            include: { rating: true }
        });

        return NextResponse.json({ success: true, store, products });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}