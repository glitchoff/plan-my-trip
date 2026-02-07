"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ResultsRedirectContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const params = searchParams.toString() ? `?${searchParams.toString()}` : "";
        router.replace(`/results/bus${params}`);
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );
}

export default function ResultsRedirect() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>}>
            <ResultsRedirectContent />
        </Suspense>
    );
}
