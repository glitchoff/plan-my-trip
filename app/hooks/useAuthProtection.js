"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuthProtection() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Redirect to login page
    }
  }, [status, router]);

  return {
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    user: session?.user,
  };
}
