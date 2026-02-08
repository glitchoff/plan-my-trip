'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function RedirectToNewChat() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Generate a new session ID
        const newId = crypto.randomUUID();
        // Preserve the prompt parameter if it exists
        const prompt = searchParams.get('prompt');
        const queryString = prompt ? `?prompt=${encodeURIComponent(prompt)}` : '';
        // Use replace to avoid polluting history with the redirect page
        router.replace(`/results/ai-chat/${newId}${queryString}`);
    }, [router, searchParams]);

    return (
        <div className="flex h-full items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={
            <div className="flex h-full items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        }>
            <RedirectToNewChat />
        </Suspense>
    );
}
