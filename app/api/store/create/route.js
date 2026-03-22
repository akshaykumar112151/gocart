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

        const formData = await request.formData();
        const name = formData.get('name');
        const username = formData.get('username');
        const description = formData.get('description');
        const email = formData.get('email');
        const contact = formData.get('contact');
        const address = formData.get('address');

        const user = await prisma.user.findFirst({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const existingStore = await prisma.store.findUnique({
            where: { userId: user.id }
        });

        if (existingStore) {
            return NextResponse.json({ success: false, message: "Store already exists" }, { status: 400 });
        }

        const store = await prisma.store.create({
            data: {
                name,
                username,
                description,
                email,
                contact,
                address,
                logo: "",
                userId: user.id,
            }
        });

        return NextResponse.json({ success: true, store });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}