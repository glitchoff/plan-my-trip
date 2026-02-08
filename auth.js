import GoogleProvider from "next-auth/providers/google"
import { getServerSession } from "next-auth"; // Import getServerSession
import { getSupabasePlus } from "@/app/lib/supabaseServer";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET_KEY,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: 'offline',
                    response_type: 'code'
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (user) {
                try {
                    // Upsert user to Supabase
                    const supabase = await getSupabasePlus();
                    const { error } = await supabase
                        .from('users')
                        .upsert({
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            image: user.image,
                            last_login: new Date().toISOString()
                        }, { onConflict: 'id' });

                    if (error) {
                        console.error("Error syncing user to Supabase:", error);
                        // We don't block sign-in if sync fails, but good to log
                    }
                } catch (err) {
                    console.error("Unexpected error syncing user:", err);
                }
            }
            return true;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        }
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
}

// Helper function to get session server-side
export const auth = () => getServerSession(authOptions);
