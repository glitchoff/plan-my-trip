"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

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
    </>
  );
}
