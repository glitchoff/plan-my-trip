'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
    const router = useRouter();

    useEffect(() => {
        // Generate a new session ID and redirect
        const newId = crypto.randomUUID();
        // Use replace to avoid polluting history with the redirect page
        router.replace(`/results/ai-chat/${newId}`);
    }, [router]);

    return (
        <div className="flex h-full items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );
}
