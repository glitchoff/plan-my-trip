'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

// Added Spinner component (DaisyUI)
const Spinner = () => <span className="loading loading-spinner loading-md"></span>;

export default function Page() {
    const { messages, sendMessage, status, stop } = useChat({
        // transport is optional in standard useChat, but respecting user's snippet
        // If this fails, standard usage is just `api: '/api/chat'`
        transport: new DefaultChatTransport({
            api: '/api/ai/chat',
        }),
    });
    const [input, setInput] = useState('');

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] p-4 max-w-3xl mx-auto">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 rounded-box bg-base-200/50">
                {messages.length === 0 && (
                    <div className="text-center text-base-content/50 mt-10">
                        <div className="text-4xl mb-2">💬</div>
                        <p>Start a conversation with the AI.</p>
                    </div>
                )}

                {messages.map(message => (
                    <div key={message.id} className={`chat ${message.role === 'user' ? 'chat-end' : 'chat-start'}`}>
                        <div className="chat-header opacity-50 text-xs mb-1">
                            {message.role === 'user' ? 'You' : 'AI Assistant'}
                        </div>
                        <div className={`chat-bubble ${message.role === 'user' ? 'chat-bubble-primary' : 'chat-bubble-secondary'}`}>
                            {message.parts.map((part, index) =>
                                part.type === 'text' ? <span key={index}>{part.text}</span> : null,
                            )}
                        </div>
                    </div>
                ))}

                {(status === 'submitted' || status === 'streaming') && (
                    <div className="flex justify-center items-center gap-2 mt-2">
                        {status === 'submitted' && <Spinner />}
                        <button
                            type="button"
                            onClick={() => stop()}
                            className="btn btn-xs btn-error btn-outline"
                        >
                            Stop generating
                        </button>
                    </div>
                )}
            </div>

            <form
                className="flex gap-2 bg-base-100 p-2 rounded-xl border border-base-300 shadow-sm"
                onSubmit={e => {
                    e.preventDefault();
                    if (input.trim()) {
                        sendMessage({ text: input }); // useChat sendMessage typically takes a string or object. User snippet: { text: input }
                        setInput('');
                    }
                }}
            >
                <input
                    className="input input-bordered flex-1 focus:outline-none"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={status !== 'ready'}
                    placeholder="Say something..."
                    autoFocus
                />
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={status !== 'ready' || !input.trim()}
                >
                    Send
                </button>
            </form>
        </div>
    );
}
