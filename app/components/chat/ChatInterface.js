'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, memo, useCallback, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Menu, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Components
import { ChatSidebar } from '@/app/components/chat/ChatSidebar';
import { ToolRegistry } from '@/app/components/chat/ToolRegistry';

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

// Memoized message component to prevent unnecessary re-renders
const ChatMessage = memo(function ChatMessage({ message }) {
    const isUser = message.role === 'user';

    return (
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} w-full mb-4`}>
            <div className={`text-xs mb-1 opacity-70 text-base-content ${isUser ? 'text-right mr-2' : 'text-left ml-2'}`}>
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

export function ChatInterface({ sessionId }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const promptFromUrl = searchParams.get('prompt');
    const hasAutoSent = useRef(false);

    // State for sessions
    const [sessions, setSessions] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Helper to save session - ref to avoid dependency cycles
    const saveSessionRef = useRef(null);

    const { messages, sendMessage, status, stop, setMessages } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/ai/chat',
        }),
        id: sessionId,
        onFinish: () => {
            if (saveSessionRef.current) saveSessionRef.current();
        },
    });

    // Load sessions from localStorage on mount
    useEffect(() => {
        const storedSessions = JSON.parse(localStorage.getItem('chat_sessions') || '[]');
        setSessions(storedSessions);
    }, []);

    // Load messages when sessionId changes
    useEffect(() => {
        if (!sessionId) return;
        const sessionKey = `chat_session_${sessionId}`;
        const storedMessages = JSON.parse(localStorage.getItem(sessionKey) || '[]');

        // IMPORTANT: Directly set messages for the new session
        if (storedMessages && storedMessages.length > 0) {
            setMessages(storedMessages);
        }
    }, [sessionId, setMessages]);


    const saveCurrentSession = useCallback(() => {
        if (!sessionId || messages.length === 0) return;

        const sessionKey = `chat_session_${sessionId}`;
        localStorage.setItem(sessionKey, JSON.stringify(messages));

        // Update session list metadata
        setSessions(prevSessions => {
            const existingSessionIndex = prevSessions.findIndex(s => s.id === sessionId);
            // Only update if something actually changed to avoid loop? 
            // Actually setSessions callback is fine as long as we don't trigger this effect recursively

            const firstMessage = messages[0];
            let titleText = 'New Chat';
            if (firstMessage) {
                if (Array.isArray(firstMessage.parts)) {
                    const textPart = firstMessage.parts.find(p => p.type === 'text');
                    if (textPart) titleText = textPart.text;
                } else if (typeof firstMessage.content === 'string') {
                    titleText = firstMessage.content;
                }
            }

            const updatedSession = {
                id: sessionId,
                title: titleText.substring(0, 40) + (titleText.length > 40 ? '...' : ''),
                updatedAt: Date.now(),
            };

            let newSessions;
            if (existingSessionIndex >= 0) {
                // If title and time basically same, maybe don't update to save renders?
                // But for now, let's just do it.
                newSessions = [...prevSessions];
                newSessions[existingSessionIndex] = updatedSession;
                newSessions.splice(existingSessionIndex, 1);
                newSessions.unshift(updatedSession);
            } else {
                newSessions = [updatedSession, ...prevSessions];
            }

            localStorage.setItem('chat_sessions', JSON.stringify(newSessions));
            return newSessions;
        });
    }, [sessionId, messages]);

    // Keep ref updated
    useEffect(() => {
        saveSessionRef.current = saveCurrentSession;
    }, [saveCurrentSession]);

    // Save session data whenever messages change - DEBOUNCED or only on finish?
    // User messages need to be saved too.
    useEffect(() => {
        if (messages.length > 0 && sessionId) {
            // We use a timeout to break the render cycle and debounce
            const timer = setTimeout(() => {
                saveCurrentSession();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [messages, sessionId, saveCurrentSession]);


    const handleNewChat = useCallback(() => {
        const newId = crypto.randomUUID();
        // Force hard reload to clear state cleanly
        window.location.href = `/results/ai-chat/${newId}`;
    }, []);

    const handleSelectSession = useCallback((id) => {
        if (id === sessionId) return;
        // Force hard reload to clear state cleanly
        window.location.href = `/results/ai-chat/${id}`;
    }, [sessionId]);

    const handleDeleteSession = useCallback((id) => {
        const newSessions = sessions.filter(s => s.id !== id);
        setSessions(newSessions);
        localStorage.setItem('chat_sessions', JSON.stringify(newSessions));
        localStorage.removeItem(`chat_session_${id}`);

        if (sessionId === id) {
            handleNewChat();
        }
    }, [sessions, sessionId, handleNewChat]);

    const [input, setInput] = useState('');
    const inputRef = useRef(null);

    // Auto-focus after status changes to ready
    useEffect(() => {
        if (status === 'ready' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [status]);

    // Auto-send prompt from URL ONLY for fresh sessions
    useEffect(() => {
        if (promptFromUrl && status === 'ready' && !hasAutoSent.current && messages.length === 0) {
            hasAutoSent.current = true;
            sendMessage({ text: promptFromUrl });
        }
    }, [promptFromUrl, status, sendMessage]);

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
        "Best place to visit this season?",
        "Which places in India are currently good to go this season?",
        "What should I pack for my North India trip this winter?",
        "Best places to visit near my location in a budget friendly way?",
    ];

    return (
        <div className="flex h-full overflow-hidden">

            {/* Back to Home Button */}
            <Link
                href="/"
                className="fixed top-20 left-4 z-30 btn btn-circle btn-sm shadow-lg bg-base-100 hover:bg-primary hover:text-primary-content transition-colors"
                title="Back to Home"
            >
                <ArrowLeft className="w-4 h-4" />
            </Link>

            {/* Mobile Sidebar Toggle */}
            <button
                className="md:hidden fixed top-20 left-16 z-30 btn btn-circle btn-sm shadow-lg bg-base-100"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                <Menu className="w-4 h-4" />
            </button>

            {/* Sidebar */}
            <ChatSidebar
                sessions={sessions}
                currentSessionId={sessionId}
                onSelectSession={handleSelectSession}
                onNewChat={handleNewChat}
                onDeleteSession={handleDeleteSession}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full relative w-full transition-all duration-300">

                <div className="flex-1 overflow-y-auto mb-4 bg-base-100/60 backdrop-blur-sm scrollbar-thin scrollbar-thumb-base-content/10">
                    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
                        {messages.length === 0 && (
                            <div className="text-center text-base-content/60 mt-20 fade-in">
                                <div className="text-6xl mb-4 animate-bounce-slow">💬</div>
                                <h2 className="text-2xl font-bold mb-2 text-base-content">AI Assistant</h2>
                                <p className="text-base-content/80 mb-8 max-w-md mx-auto">
                                    Your personal travel guide. Ask me anything about destinations, itineraries, or travel tips!
                                </p>

                                <div className="max-w-2xl mx-auto">
                                    <p className="text-sm text-base-content/60 mb-4 font-medium uppercase tracking-wide">Try asking:</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {suggestedPrompts.map((prompt, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSuggestionClick(prompt)}
                                                disabled={status !== 'ready'}
                                                className="p-3 text-left text-sm bg-base-200/50 hover:bg-primary hover:text-primary-content rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed border border-base-content/5"
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

                        {/* Loading/Thinking Indicator - Left Aligned */}
                        {(status === 'submitted' || status === 'streaming') && (
                            <div className="flex justify-start items-center gap-2 mt-4 opacity-70 ml-2">
                                <span className="loading loading-dots loading-md text-primary"></span>
                                <span className="text-xs text-base-content/50 font-medium tracking-wide">Thinking...</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full flex justify-center px-4 pb-4">
                    <form
                        className="flex gap-2 w-full max-w-3xl bg-base-100/90 backdrop-blur-md p-2 rounded-2xl border border-base-content/10 shadow-lg ring-1 ring-base-content/5 focus-within:ring-2 focus-within:ring-primary/20 transition-all"
                        onSubmit={handleSubmit}
                    >
                        <input
                            ref={inputRef}
                            className="input input-ghost flex-1 focus:bg-transparent focus:outline-none text-base-content placeholder:text-base-content/40 h-10 min-h-0"
                            value={input}
                            onChange={handleInputChange}
                            disabled={status !== 'ready'}
                            placeholder="Ask about destinations, flights, or hotels..."
                        />
                        <button
                            type="submit"
                            className="btn btn-primary btn-sm h-10 min-h-0 rounded-xl px-6 shadow-sm"
                            disabled={status !== 'ready' || !input.trim()}
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
