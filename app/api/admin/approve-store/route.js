import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        if (session.user.email !== ADMIN_EMAIL) {
            return NextResponse.json({ success: false, message: "Forbidden — Admins only" }, { status: 403 });
        }

        const { storeId, status } = await request.json();

        const store = await prisma.store.update({
            where: { id: storeId },
            data: {
                status,
                isActive: status === 'approved'
            }
        });

        return NextResponse.json({ success: true, store });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

