import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
    try {
        const { code } = await request.json();

        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!coupon) {
            return NextResponse.json({ success: false, message: "Invalid coupon code!" });
        }

        if (new Date(coupon.expiresAt) < new Date()) {
            return NextResponse.json({ success: false, message: "Coupon has expired!" });
        }

        return NextResponse.json({ success: true, coupon });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}