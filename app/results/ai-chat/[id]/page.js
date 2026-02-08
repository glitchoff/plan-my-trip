'use client';

import { use } from 'react';
import { ChatInterface } from '@/app/components/chat/ChatInterface';

export default function Page({ params }) {
    const resolvedParams = use(params);
    return <ChatInterface sessionId={resolvedParams.id} />;
}
