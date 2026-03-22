import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PUT(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { addressId, name, email, street, city, state, zip, country, phone } = await req.json();

        const user = await prisma.user.findFirst({
            where: { email: session.user.email }
        });

        const address = await prisma.address.findFirst({
            where: { id: addressId, userId: user.id }
        });

        if (!address) {
            return NextResponse.json({ success: false, message: "Address not found" }, { status: 404 });
        }

        const updated = await prisma.address.update({
            where: { id: addressId },
            data: { name, email, street, city, state, zip, country, phone }
        });

        return NextResponse.json({ success: true, address: updated });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}