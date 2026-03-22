import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            try {
                const existingUser = await prisma.user.findFirst({
                    where: { email: user.email },
                });
                if (!existingUser) {
                    await prisma.user.create({
                        data: {
                            id: account.providerAccountId,
                            name: user.name,
                            email: user.email,
                            image: user.image,
                        },
                    });
                }
                return true;
            } catch (error) {
                console.error("SignIn error:", error);
                return false;
            }
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };