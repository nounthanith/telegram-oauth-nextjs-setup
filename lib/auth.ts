import NextAuth from "next-auth"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/user.model"

export const { handlers, auth, signIn, signOut } = NextAuth({
    debug: true,
    trustHost: true,
    secret: process.env.AUTH_SECRET,
    providers: [
        {
            id: "telegram",
            name: "Telegram",
            type: "oidc",
            clientId: process.env.TELEGRAM_CLIENT_ID,
            clientSecret: process.env.TELEGRAM_CLIENT_SECRET,
            issuer: "https://oauth.telegram.org",
            authorization: {
                url: "https://oauth.telegram.org/auth",
                params: { scope: "openid profile" },
            },
            token: "https://oauth.telegram.org/token",
            jwks_endpoint: "https://oauth.telegram.org/.well-known/jwks.json",
            idToken: true,
            checks: ["pkce"],
            client: { token_endpoint_auth_method: "client_secret_basic" },
            profile(p) {
                return { id: p.sub, name: p.name, image: p.picture }
            },
        },
    ],
    callbacks: {
        async signIn({ profile }) {
            await connectDB()
            await User.findOneAndUpdate(
                { telegramId: profile?.sub },
                {
                    $set: {
                        name: profile?.name,
                        username: profile?.preferred_username,
                        image: profile?.picture,
                    },
                },
                { upsert: true, new: true }
            )
            return true
        },
        async jwt({ token, profile }) {
            if (profile) {
                await connectDB()
                const user = await User.findOne({ telegramId: profile.sub })
                token.userId = user._id.toString()
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            ; (session.user as any).id = token.userId
                ; (session.user as any).role = token.role
            return session
        },
    },
})