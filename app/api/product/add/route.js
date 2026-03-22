import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import cloudinary from "cloudinary";

cloudinary.v2.config({
    cloud_name: "dqkjlbgpm",
    api_key: "775221763725952",
    api_secret: "JwzCvKe59dIU1ymCJ2rprEvJxXQ",
});

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const name = formData.get('name');
        const description = formData.get('description');
        const mrp = parseFloat(formData.get('mrp'));
        const price = parseFloat(formData.get('price'));
        const category = formData.get('category');
        const imageFiles = formData.getAll('images');

        const user = await prisma.user.findFirst({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const store = await prisma.store.findUnique({
            where: { userId: user.id }
        });

        if (!store) {
            return NextResponse.json({ success: false, message: "Store not found" }, { status: 404 });
        }

        const imageUrls = [];
        for (const file of imageFiles) {
            if (file && file.size > 0) {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const result = await new Promise((resolve, reject) => {
                    cloudinary.v2.uploader.upload_stream(
                        { resource_type: "auto" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    ).end(buffer);
                });
                imageUrls.push(result.secure_url);
            }
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                mrp,
                price,
                category,
                images: imageUrls,
                storeId: store.id,
            }
        });

        return NextResponse.json({ success: true, product });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}