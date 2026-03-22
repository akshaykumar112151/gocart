/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { hostname: 'res.cloudinary.com' },
            { hostname: 'upload.wikimedia.org' },
            { hostname: 'lh3.googleusercontent.com' },
        ]
    },
    // Webhook ke liye raw body chahiye
    async headers() {
        return [
            {
                source: '/api/payment/webhook',
                headers: [{ key: 'Content-Type', value: 'application/json' }]
            }
        ]
    }
};

export default nextConfig;