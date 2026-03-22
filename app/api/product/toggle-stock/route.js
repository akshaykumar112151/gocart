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

        const { productId } = await request.json();

        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        const updated = await prisma.product.update({
            where: { id: productId },
            data: { inStock: !product.inStock }
        });

        return NextResponse.json({ success: true, product: updated });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}