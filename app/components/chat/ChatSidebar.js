'use client';

import { Plus, MessageSquare, Trash2, X, Timer, ChevronLeft, ChevronRight, History } from 'lucide-react';
import { memo, useState } from 'react';

export const ChatSidebar = memo(function ChatSidebar({
    sessions = [],
    currentSessionId,
    onSelectSession,
    onNewChat,
    onDeleteSession,
    isOpen,
    onClose
}) {
    const [isCollapsed, setIsCollapsed] = useState(true);

    // Format date for display (e.g., "Today", "Yesterday", "MMM DD")
    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    // Group sessions by date
    const groupedSessions = sessions.reduce((groups, session) => {
        const dateGroup = formatDate(session.updatedAt);
        if (!groups[dateGroup]) {
            groups[dateGroup] = [];
        }
        groups[dateGroup].push(session);
        return groups;
    }, {});

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <div className={`
                fixed inset-y-0 left-0 z-40 bg-base-100 border-r border-base-content/10 transform transition-all duration-300 ease-in-out
                md:relative md:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                ${isCollapsed ? 'md:w-20' : 'md:w-72 w-72'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className={`p-4 border-b border-base-content/10 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                        {!isCollapsed && (
                            <h2 className="font-bold text-lg text-base-content flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-primary" />
                                History
                            </h2>
                        )}
                        <button
                            onClick={onClose}
                            className="md:hidden btn btn-ghost btn-sm btn-square"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* New Chat Button */}
                    <div className="p-4">
                        <button
                            onClick={onNewChat}
                            className={`btn btn-primary w-full shadow-lg hover:scale-[1.02] transition-transform ${isCollapsed ? 'btn-square px-0' : 'gap-2'}`}
                            title="New Chat"
                        >
                            <Plus className="w-5 h-5" />
                            {!isCollapsed && "New Chat"}
                        </button>
                    </div>

                    {/* Desktop Collapse Toggle */}
                    <button
                        onClick={toggleCollapse}
                        className="hidden md:flex absolute -right-3 top-1/2 transform -translate-y-1/2 bg-base-100 border border-base-content/10 rounded-full p-1 shadow-md z-50 text-base-content/70 hover:text-primary"
                    >
                        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>

                    {/* Session List */}
                    <div className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-thin scrollbar-thumb-base-content/10 scrollbar-track-transparent">

                        {isCollapsed ? (
                            // Collapsed View: Show icons only (simplified)
                            <div className="flex flex-col items-center gap-2 mt-2">
                                {sessions.map(session => (
                                    <button
                                        key={session.id}
                                        onClick={() => onSelectSession(session.id)}
                                        className={`btn btn-ghost btn-square btn-sm ${currentSessionId === session.id ? 'btn-active text-primary' : 'text-base-content/60'}`}
                                        title={session.title || 'Chat'}
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                    </button>
                                ))}
                            </div>
                        ) : (
                            // Expanded View: Full list
                            sessions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-40 text-base-content/40 text-sm">
                                    <Timer className="w-8 h-8 mb-2 opacity-50" />
                                    <p>No previous chats</p>
                                </div>
                            ) : (
                                Object.entries(groupedSessions).map(([dateGroup, groupSessions]) => (
                                    <div key={dateGroup} className="mb-4">
                                        <h3 className="px-4 py-2 text-xs font-semibold text-base-content/40 uppercase tracking-wider">
                                            {dateGroup}
                                        </h3>
                                        <div className="space-y-1">
                                            {groupSessions.map((session) => (
                                                <div
                                                    key={session.id}
                                                    className={`group relative flex items-center gap-3 px-3 py-3 mx-2 rounded-xl cursor-pointer transition-all duration-200
                                                        ${currentSessionId === session.id
                                                            ? 'bg-primary/10 text-primary font-medium'
                                                            : 'hover:bg-base-200 text-base-content/80 hover:text-base-content'
                                                        }`}
                                                    onClick={() => {
                                                        onSelectSession(session.id);
                                                        if (window.innerWidth < 768) onClose();
                                                    }}
                                                >
                                                    <MessageSquare className={`w-4 h-4 shrink-0 ${currentSessionId === session.id ? 'text-primary' : 'opacity-50'}`} />
                                                    <span className="truncate text-sm flex-1">
                                                        {session.title || 'New Chat'}
                                                    </span>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onDeleteSession(session.id);
                                                        }}
                                                        className={`absolute right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error/10 hover:text-error
                                                            ${currentSessionId === session.id ? 'opacity-100' : ''}`}
                                                        title="Delete chat"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )
                        )}
                    </div>
                </div>
            </div>
        </>
    );
});
