import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = { id: "1", name: "J Smith", email: "user@example.com" };

        if (credentials?.email === "user@example.com" && credentials?.password === "password") {
            return user
        } else {
            return null
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
      async session({ session, token, user }) {
          return session
      },
      async jwt({ token, user, account, profile, isNewUser }) {
          return token
      }
  }
});

export { handler as GET, handler as POST };
