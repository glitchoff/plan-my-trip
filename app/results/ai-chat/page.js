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
        <div className="flex flex-col h-screen pt-20 pb-4 px-4 max-w-3xl mx-auto">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-6 rounded-2xl bg-base-100/80 backdrop-blur-md border border-base-content/10 shadow-lg">
                {messages.length === 0 && (
                    <div className="text-center text-base-content/60 mt-20">
                        <div className="text-6xl mb-4">💬</div>
                        <h2 className="text-2xl font-bold mb-2 text-base-content">AI Assistant</h2>
                        <p className="text-base-content/80">Ask me anything about your trip!</p>
                    </div>
                )}

                {messages.map(message => (
                    <div key={message.id} className={`chat ${message.role === 'user' ? 'chat-end' : 'chat-start'}`}>
                        <div className="chat-header text-xs mb-1 opacity-70 text-base-content">
                            {message.role === 'user' ? 'You' : 'AI Assistant'}
                        </div>
                        <div className={`chat-bubble shadow-md ${
                            message.role === 'user' 
                            ? 'chat-bubble-primary text-primary-content' 
                            : 'bg-base-200 text-base-content'
                        }`}>
                            {message.parts.map((part, index) =>
                                part.type === 'text' ? <span key={index}>{part.text}</span> : null,
                            )}
                        </div>
                    </div>
                ))}

                {(status === 'submitted' || status === 'streaming') && (
                    <div className="flex justify-start items-center gap-2 mt-2 ml-2">
                        <span className="loading loading-dots loading-md text-primary"></span>
                        <span className="text-xs text-base-content/50">Thinking...</span>
                    </div>
                )}
            </div>

            <form
                className="flex gap-2 bg-base-100/90 backdrop-blur-md p-3 rounded-2xl border border-base-content/10 shadow-lg"
                onSubmit={e => {
                    e.preventDefault();
                    if (input.trim()) {
                        sendMessage({ text: input }); // Keep existing logic for now
                        setInput('');
                    }
                }}
            >
                <input
                    className="input input-bordered flex-1 bg-transparent focus:outline-none text-base-content placeholder:text-base-content/50"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={status !== 'ready'}
                    placeholder="Ask about destinations, flights, or hotels..."
                    autoFocus
                />
                <button
                    type="submit"
                    className="btn btn-primary rounded-xl px-6"
                    disabled={status !== 'ready' || !input.trim()}
                >
                    Send
                </button>
            </form>
        </div>
    );
}
