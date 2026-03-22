const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // Pehle store dhundo
    const store = await prisma.store.findFirst()
    
    if (!store) {
        console.log('No store found! Please create a store first.')
        return
    }

    console.log('Found store:', store.name)

    // Dummy products
    const products = [
        {
            name: "Apple AirPods Pro",
            description: "Active Noise Cancellation, Transparency mode, Spatial Audio",
            mrp: 249,
            price: 199,
            category: "Electronics",
            images: ["https://res.cloudinary.com/dqkjlbgpm/image/upload/v1774178605/fm5aoxgugak9y4w16f7c.jpg"],
            storeId: store.id
        },
        {
            name: "Smart Watch Series 8",
            description: "Health monitoring, GPS, Water resistant",
            mrp: 399,
            price: 299,
            category: "Electronics",
            images: ["https://res.cloudinary.com/dqkjlbgpm/image/upload/v1774178605/fm5aoxgugak9y4w16f7c.jpg"],
            storeId: store.id
        },
        {
            name: "Wireless Headphones",
            description: "30hr battery, Noise cancellation, Premium sound",
            mrp: 199,
            price: 149,
            category: "Electronics",
            images: ["https://res.cloudinary.com/dqkjlbgpm/image/upload/v1774178605/fm5aoxgugak9y4w16f7c.jpg"],
            storeId: store.id
        },
        {
            name: "Smart Speaker",
            description: "360 sound, Voice assistant, Multi-room audio",
            mrp: 99,
            price: 79,
            category: "Electronics",
            images: ["https://res.cloudinary.com/dqkjlbgpm/image/upload/v1774178605/fm5aoxgugak9y4w16f7c.jpg"],
            storeId: store.id
        },
        {
            name: "Security Camera",
            description: "4K resolution, Night vision, Motion detection",
            mrp: 149,
            price: 99,
            category: "Electronics",
            images: ["https://res.cloudinary.com/dqkjlbgpm/image/upload/v1774178605/fm5aoxgugak9y4w16f7c.jpg"],
            storeId: store.id
        },
        {
            name: "Robot Vacuum",
            description: "Auto cleaning, App control, 120min battery",
            mrp: 299,
            price: 199,
            category: "Home & Kitchen",
            images: ["https://res.cloudinary.com/dqkjlbgpm/image/upload/v1774178605/fm5aoxgugak9y4w16f7c.jpg"],
            storeId: store.id
        },
    ]

    for (const product of products) {
        await prisma.product.create({ data: product })
        console.log('Created product:', product.name)
    }

    console.log('✅ All products added successfully!')
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())