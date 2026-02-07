"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResultsRedirect() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const params = searchParams.toString() ? `?${searchParams.toString()}` : "";
        router.replace(`/results/bus${params}`);
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
    );
}
