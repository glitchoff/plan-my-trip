'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, memo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BusList } from '@/app/components/chat/BusList';

// Memoized markdown renderer to prevent re-parsing on every render
const MarkdownContent = memo(function MarkdownContent({ text }) {
    return (
        <div className="prose prose-sm max-w-none prose-headings:text-base-content prose-p:text-base-content prose-li:text-base-content prose-strong:text-base-content prose-code:text-primary prose-code:bg-base-300 prose-code:px-1 prose-code:rounded prose-table:text-base-content prose-th:text-base-content prose-td:text-base-content [&_th]:border [&_th]:border-base-content/20 [&_th]:px-3 [&_th]:py-2 [&_td]:border [&_td]:border-base-content/20 [&_td]:px-3 [&_td]:py-2">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    table: ({ children }) => (
                        <div className="overflow-x-auto -mx-2 px-2">
                            <table className="border border-base-content/20 min-w-full">
                                {children}
                            </table>
                        </div>
                    ),
                }}
            >
                {text}
            </ReactMarkdown>
        </div>
    );
});

import { ToolRegistry } from '@/app/components/chat/ToolRegistry';

// Memoized message component to prevent unnecessary re-renders
const ChatMessage = memo(function ChatMessage({ message }) {
    const isUser = message.role === 'user';

    return (
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-center'} w-full mb-4`}>
            <div className={`text-xs mb-1 opacity-70 text-base-content ${isUser ? 'text-right mr-2' : 'text-center'}`}>
                {isUser ? 'You' : 'AI Assistant'}
            </div>
            <div className={`chat-bubble shadow-md ${isUser
                ? 'chat-bubble-primary text-primary-content'
                : 'bg-base-200 text-base-content'
                } ${!isUser && message.parts.some(p => p.type.startsWith('tool-')) ? 'w-[80%] max-w-none' : 'max-w-[85%] md:max-w-[80%]'}`}>
                {message.parts.map((part, index) => {
                    switch (part.type) {
                        case 'text':
                            return isUser ? (
                                <span key={index}>{part.text}</span>
                            ) : (
                                <MarkdownContent key={index} text={part.text} />
                            );

                        case 'step-start':
                            return (
                                <div key={index} className="text-base-content/30 my-2">
                                    <hr className="border-base-content/10" />
                                </div>
                            );

                        default:
                            // Handle tools dynamically from registry
                            if (part.type.startsWith('tool-')) {
                                const toolName = part.type.replace('tool-', '');
                                const ToolComponent = ToolRegistry[toolName];

                                if (ToolComponent) {
                                    return <ToolComponent key={index} {...part} />;
                                }

                                return (
                                    <div key={index} className="text-xs opacity-50 my-1 bg-base-300/30 p-2 rounded-lg">
                                        Using tool: {toolName}...
                                    </div>
                                );
                            }
                            return null;
                    }
                })}
            </div>
        </div>
    );
});

export default function Page() {
    const searchParams = useSearchParams();
    const promptFromUrl = searchParams.get('prompt');
    const hasAutoSent = useRef(false);

    const { messages, sendMessage, status, stop } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/ai/chat',
        }),
    });
    const [input, setInput] = useState('');
    const inputRef = useRef(null);

    // Auto-focus the input when status is 'ready'
    useEffect(() => {
        if (status === 'ready' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [status]);

    // Auto-send prompt from URL when page loads
    useEffect(() => {
        if (promptFromUrl && status === 'ready' && !hasAutoSent.current && messages.length === 0) {
            hasAutoSent.current = true;
            sendMessage({ text: promptFromUrl });
        }
    }, [promptFromUrl, status, sendMessage, messages.length]);

    // No auto-scroll - user has full control over scrolling

    const handleInputChange = useCallback((e) => {
        setInput(e.target.value);
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (input.trim()) {
            sendMessage({ text: input });
            setInput('');
        }
    }, [input, sendMessage]);

    const handleSuggestionClick = useCallback((suggestion) => {
        if (status === 'ready') {
            sendMessage({ text: suggestion });
        }
    }, [status, sendMessage]);

    const suggestedPrompts = [
        "What type of places do you love to visit?",
        "Which places in India are currently good to go this season?",
        "Need help planning your next adventure?",
        "Looking for hidden gems to explore in India?",
    ];

    return (
        <div className="flex flex-col h-full pb-4">
            <div className="flex-1 overflow-y-auto mb-4 bg-base-100/60 backdrop-blur-sm">
                <div className="max-w-[80%] mx-auto p-6 space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center text-base-content/60 mt-20">
                            <div className="text-6xl mb-4">💬</div>
                            <h2 className="text-2xl font-bold mb-2 text-base-content">AI Assistant</h2>
                            <p className="text-base-content/80 mb-8">Ask me anything about your trip!</p>

                            <div className="max-w-2xl mx-auto">
                                <p className="text-sm text-base-content/60 mb-4">Try asking:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {suggestedPrompts.map((prompt, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSuggestionClick(prompt)}
                                            disabled={status !== 'ready'}
                                            className="p-3 text-left text-sm bg-base-200 hover:bg-primary hover:text-primary-content rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {messages.map(message => (
                        <ChatMessage key={message.id} message={message} />
                    ))}

                    {(status === 'submitted' || status === 'streaming') && (
                        <div className="flex justify-center items-center gap-2 mt-2">
                            <span className="loading loading-dots loading-md text-primary"></span>
                            <span className="text-xs text-base-content/50">Thinking...</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full flex justify-center px-4">
                <form
                    className="flex gap-2 w-full max-w-[80%] bg-base-100/90 backdrop-blur-md p-3 rounded-2xl border border-base-content/10 shadow-lg"
                    onSubmit={handleSubmit}
                >
                    <input
                        ref={inputRef}
                        className="input input-bordered flex-1 bg-transparent focus:outline-none text-base-content placeholder:text-base-content/50"
                        value={input}
                        onChange={handleInputChange}
                        disabled={status !== 'ready'}
                        placeholder="Ask about destinations, flights, or hotels..."
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
        </div>
    );
}
