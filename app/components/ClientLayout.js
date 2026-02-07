"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AIChatWidget from "./AIChatWidget";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAIChat = pathname?.startsWith("/results/ai-chat");
  const isResultsPage = pathname?.startsWith("/results");

  return (
    <>
      {!isAIChat && <Navbar />}
      <main className={`relative z-10 ${!isAIChat ? "pt-16" : ""}`}>
        {children}
      </main>
      {!isResultsPage && <Footer />}
      {/* Floating AI Chat Widget - shows on all pages except AI Chat (AND now unexpected on Results Pages) */}
      {!isResultsPage && <AIChatWidget />}
    </>
  );
}
