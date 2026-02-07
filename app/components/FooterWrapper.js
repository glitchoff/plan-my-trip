"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();
  const isResultsPage = pathname?.startsWith("/results");

  if (isResultsPage) {
    return null;
  }

  return <Footer />;
}
