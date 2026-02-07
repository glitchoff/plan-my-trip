import { Space_Grotesk, Geist_Mono, Pacifico } from "next/font/google";
import "./globals.css";
import ClientLayout from "./components/ClientLayout";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "Plan My Trip",
  description: "Your ultimate travel planning companion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${geistMono.variable} ${pacifico.variable} antialiased font-sans`}
        style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
      >
        <LanguageProvider>
          <AuthProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
