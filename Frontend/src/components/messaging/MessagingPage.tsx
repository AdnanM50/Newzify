import { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../../context/SocketContext';
import {
    getChatUsers,
    getConversations,
    getOrCreateConversation,
    getMessages,
    sendMessageApi,
    markMessagesRead,
} from '../../helpers/backend';
import {
    MessageCircle,
    Send,
    Search,
    ArrowLeft,
    Circle,
    CheckCheck,
    Check,
} from 'lucide-react';

interface MessagingPageProps {
    panelType: 'admin' | 'reporter';
}

interface ChatUser {
    _id: string;
    first_name: string;
    last_name: string;
    image?: string;
    role: string;
    email: string;
}

interface Message {
    _id: string;
    conversation: string;
    sender: { _id: string; first_name: string; last_name: string; image?: string; role: string } | string;
    content: string;
    read: boolean;
    createdAt: string;
}

interface Conversation {
    _id: string;
    participants: ChatUser[];
    lastMessage?: {
        content: string;
        sender: string;
        createdAt: string;
        read: boolean;
    };
    updatedAt: string;
}

// Theme definitions
const themes = {
    admin: {
        sidebarBg: 'bg-gray-800',
        sidebarBorder: 'border-gray-700',
        sidebarHover: 'hover:bg-gray-700',
        sidebarActive: 'bg-gray-700',
        sidebarText: 'text-gray-300',
        sidebarTextActive: 'text-white',
        headerBg: 'bg-gray-800',
        headerText: 'text-white',
        sentBubble: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
        sentText: 'text-white',
        receivedBubble: 'bg-gray-100',
        receivedText: 'text-gray-800',
        accent: 'text-emerald-500',
        accentBg: 'bg-emerald-500',
        accentHover: 'hover:bg-emerald-600',
        badge: 'bg-emerald-500',
        inputFocus: 'focus:ring-emerald-500 focus:border-emerald-500',
        roleBadge: 'bg-emerald-100 text-emerald-700',
        onlineDot: 'text-emerald-400',
        searchBg: 'bg-gray-700',
        searchText: 'text-gray-200',
        searchPlaceholder: 'placeholder-gray-400',
    },
    reporter: {
        sidebarBg: 'bg-indigo-900',
        sidebarBorder: 'border-indigo-800',
        sidebarHover: 'hover:bg-indigo-800',
        sidebarActive: 'bg-indigo-800',
        sidebarText: 'text-indigo-200',
        sidebarTextActive: 'text-white',
        headerBg: 'bg-indigo-900',
        headerText: 'text-white',
        sentBubble: 'bg-gradient-to-br from-violet-500 to-violet-600',
        sentText: 'text-white',
        receivedBubble: 'bg-gray-100',
        receivedText: 'text-gray-800',
        accent: 'text-violet-500',
        accentBg: 'bg-violet-500',
        accentHover: 'hover:bg-violet-600',
        badge: 'bg-violet-500',
        inputFocus: 'focus:ring-violet-500 focus:border-violet-500',
        roleBadge: 'bg-violet-100 text-violet-700',
        onlineDot: 'text-emerald-400',
        searchBg: 'bg-indigo-800',
        searchText: 'text-indigo-100',
        searchPlaceholder: 'placeholder-indigo-300',
    },
};

export default function MessagingPage({ panelType }: MessagingPageProps) {
    const theme = themes[panelType];
    const { socket, onlineUsers } = useSocket();

    const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [showMobileChat, setShowMobileChat] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messageInputRef = useRef<HTMLInputElement>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Get current user from localStorage
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/v1/user/profile', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                const data = await res.json();
                if (data.success) setCurrentUser(data.data);
            } catch (e) {
                console.error('Error fetching profile:', e);
            }
        };
        fetchProfile();
    }, []);

    // Load chat users and conversations
    useEffect(() => {
        const loadData = async () => {
            try {
                const [usersRes, convsRes] = await Promise.all([
                    getChatUsers(),
                    getConversations(),
                ]);
                if (usersRes.success) setChatUsers(usersRes.data as any);
                if (convsRes.success) setConversations(convsRes.data as any);
            } catch (e) {
                console.error('Error loading data:', e);
            }
        };
        loadData();
    }, []);

    // Socket event listeners
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message: Message) => {
            setMessages((prev) => [...prev, message]);
            // Update conversation's last message
            setConversations((prev) =>
                prev.map((conv) => {
                    if (conv._id === (typeof message.conversation === 'string' ? message.conversation : (message as any).conversation)) {
                        return {
                            ...conv,
                            lastMessage: {
                                content: message.content,
                                sender: typeof message.sender === 'string' ? message.sender : message.sender._id,
                                createdAt: message.createdAt,
                                read: message.read,
                            },
                            updatedAt: message.createdAt,
                        };
                    }
                    return conv;
                })
            );
        };

        const handleTyping = ({ userId, conversationId }: { userId: string; conversationId: string }) => {
            if (activeConversation?._id === conversationId) {
                setTypingUser(userId);
            }
        };

        const handleStopTyping = ({ conversationId }: { userId: string; conversationId: string }) => {
            if (activeConversation?._id === conversationId) {
                setTypingUser(null);
            }
        };

        socket.on('new_message', handleNewMessage);
        socket.on('typing', handleTyping);
        socket.on('stop_typing', handleStopTyping);

        return () => {
            socket.off('new_message', handleNewMessage);
            socket.off('typing', handleTyping);
            socket.off('stop_typing', handleStopTyping);
        };
    }, [socket, activeConversation]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Open conversation with a user
    const openConversation = useCallback(async (user: ChatUser) => {
        setLoading(true);
        try {
            const res = await getOrCreateConversation({ participantId: user._id });
            if (res.success) {
                const conv = res.data as Conversation;
                setActiveConversation(conv);
                setShowMobileChat(true);

                // Join socket room
                socket?.emit('join_conversation', conv._id);

                // Load messages
                const msgRes = await getMessages({ conversationId: conv._id });
                if (msgRes.success) {
                    setMessages((msgRes.data as any).messages || []);
                }

                // Mark as read
                await markMessagesRead({ conversationId: conv._id });

                // Update local conversation list
                setConversations((prev) => {
                    const exists = prev.find((c) => c._id === conv._id);
                    if (!exists) return [conv, ...prev];
                    return prev;
                });
            }
        } catch (e) {
            console.error('Error opening conversation:', e);
        }
        setLoading(false);
    }, [socket]);

    // Open existing conversation
    const openExistingConversation = useCallback(async (conv: Conversation) => {
        setActiveConversation(conv);
        setShowMobileChat(true);
        setLoading(true);

        // Leave previous room and join new
        socket?.emit('join_conversation', conv._id);

        try {
            const msgRes = await getMessages({ conversationId: conv._id });
            if (msgRes.success) {
                setMessages((msgRes.data as any).messages || []);
            }
            await markMessagesRead({ conversationId: conv._id });
        } catch (e) {
            console.error('Error loading messages:', e);
        }
        setLoading(false);
    }, [socket]);

    // Send message
    const handleSendMessage = async () => {
        if (!newMessage.trim() || !activeConversation) return;

        const content = newMessage.trim();
        setNewMessage('');

        try {
            const res = await sendMessageApi({
                conversationId: activeConversation._id,
                content,
            });

            if (res.success) {
                const sentMessage = res.data as Message;
                setMessages((prev) => [...prev, sentMessage]);

                // Broadcast via socket
                socket?.emit('send_message', {
                    conversationId: activeConversation._id,
                    message: sentMessage,
                });

                // Stop typing
                socket?.emit('stop_typing', { conversationId: activeConversation._id });

                // Update conversation's last message
                setConversations((prev) =>
                    prev.map((conv) => {
                        if (conv._id === activeConversation._id) {
                            return {
                                ...conv,
                                lastMessage: {
                                    content: sentMessage.content,
                                    sender: currentUser?._id || '',
                                    createdAt: sentMessage.createdAt,
                                    read: false,
                                },
                                updatedAt: sentMessage.createdAt,
                            };
                        }
                        return conv;
                    })
                );
            }
        } catch (e) {
            console.error('Error sending message:', e);
        }
    };

    // Handle typing indicator
    const handleTyping = () => {
        if (!activeConversation || !socket) return;
        socket.emit('typing', { conversationId: activeConversation._id });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stop_typing', { conversationId: activeConversation._id });
        }, 2000);
    };

    // Get the other participant in a conversation
    const getOtherParticipant = (conv: Conversation): ChatUser | undefined => {
        return conv.participants?.find((p) => p._id !== currentUser?._id);
    };

    // Format timestamp
    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays < 7) return `${diffDays}d`;
        return date.toLocaleDateString();
    };

    const formatMessageTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Filter users by search
    const filteredUsers = chatUsers.filter((u) => {
        const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase()) || u.role.includes(searchTerm.toLowerCase());
    });

    // Get avatar initials
    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    };

    // Get typing user name
    const getTypingUserName = () => {
        if (!typingUser) return '';
        const user = chatUsers.find((u) => u._id === typingUser);
        return user ? user.first_name : 'Someone';
    };

    // Back to contacts on mobile
    const handleBackToContacts = () => {
        setShowMobileChat(false);
        if (activeConversation) {
            socket?.emit('leave_conversation', activeConversation._id);
        }
    };

    return (
        <div className="h-[calc(100vh-7rem)] flex rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
            {/* Left Panel - Contacts & Conversations */}
            <div className={`${showMobileChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 lg:w-96 ${theme.sidebarBg} ${theme.sidebarBorder} border-r flex-shrink-0`}>
                {/* Header */}
                <div className={`p-4 ${theme.sidebarBorder} border-b`}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-xl ${theme.accentBg} flex items-center justify-center`}>
                            <MessageCircle size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className={`text-lg font-bold ${theme.headerText}`}>Messages</h2>
                            <p className={`text-xs ${theme.sidebarText}`}>
                                {onlineUsers.length} online
                            </p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.sidebarText}`} />
                        <input
                            type="text"
                            placeholder="Search people..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-9 pr-4 py-2.5 rounded-xl ${theme.searchBg} ${theme.searchText} ${theme.searchPlaceholder} text-sm border-none outline-none focus:ring-2 ${theme.inputFocus} transition-all`}
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {/* Active Conversations */}
                    {conversations.length > 0 && (
                        <div className="p-2">
                            <p className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${theme.sidebarText}`}>
                                Recent Chats
                            </p>
                            {conversations.map((conv) => {
                                const other = getOtherParticipant(conv);
                                if (!other) return null;
                                const isActive = activeConversation?._id === conv._id;
                                const isOnline = onlineUsers.includes(other._id);

                                return (
                                    <button
                                        key={conv._id}
                                        onClick={() => openExistingConversation(conv)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl mb-1 transition-all duration-200 ${
                                            isActive
                                                ? `${theme.sidebarActive} ${theme.sidebarTextActive} ring-1 ring-white/10`
                                                : `${theme.sidebarText} ${theme.sidebarHover}`
                                        }`}
                                    >
                                        <div className="relative flex-shrink-0">
                                            {other.image ? (
                                                <img src={other.image} alt="" className="w-11 h-11 rounded-full object-cover ring-2 ring-white/10" />
                                            ) : (
                                                <div className={`w-11 h-11 rounded-full ${theme.accentBg} flex items-center justify-center text-white text-sm font-bold ring-2 ring-white/10`}>
                                                    {getInitials(other.first_name, other.last_name)}
                                                </div>
                                            )}
                                            {isOnline && (
                                                <Circle size={12} className={`absolute -bottom-0.5 -right-0.5 fill-emerald-400 ${theme.onlineDot} stroke-gray-800`} strokeWidth={3} />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 text-left">
                                            <div className="flex items-center justify-between">
                                                <p className={`font-semibold text-sm truncate ${isActive ? theme.sidebarTextActive : theme.sidebarText}`}>
                                                    {other.first_name} {other.last_name}
                                                </p>
                                                {conv.lastMessage?.createdAt && (
                                                    <span className={`text-[10px] flex-shrink-0 ml-2 ${theme.sidebarText} opacity-70`}>
                                                        {formatTime(conv.lastMessage.createdAt)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <p className={`text-xs truncate flex-1 ${theme.sidebarText} opacity-70`}>
                                                    {conv.lastMessage?.content || 'Start a conversation...'}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* All Users */}
                    <div className="p-2">
                        <p className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${theme.sidebarText}`}>
                            All People
                        </p>
                        {filteredUsers.map((user) => {
                            const isOnline = onlineUsers.includes(user._id);
                            return (
                                <button
                                    key={user._id}
                                    onClick={() => openConversation(user)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl mb-1 transition-all duration-200 ${theme.sidebarText} ${theme.sidebarHover}`}
                                >
                                    <div className="relative flex-shrink-0">
                                        {user.image ? (
                                            <img src={user.image} alt="" className="w-11 h-11 rounded-full object-cover ring-2 ring-white/10" />
                                        ) : (
                                            <div className={`w-11 h-11 rounded-full ${theme.accentBg} flex items-center justify-center text-white text-sm font-bold ring-2 ring-white/10`}>
                                                {getInitials(user.first_name, user.last_name)}
                                            </div>
                                        )}
                                        {isOnline && (
                                            <Circle size={12} className={`absolute -bottom-0.5 -right-0.5 fill-emerald-400 ${theme.onlineDot} stroke-gray-800`} strokeWidth={3} />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <p className={`font-semibold text-sm truncate ${theme.sidebarText}`}>
                                            {user.first_name} {user.last_name}
                                        </p>
                                        <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-full capitalize ${
                                            user.role === 'admin'
                                                ? 'bg-amber-100 text-amber-700'
                                                : theme.roleBadge
                                        }`}>
                                            {user.role}
                                        </span>
                                    </div>
                                    {isOnline && (
                                        <span className="text-[10px] text-emerald-400 font-medium">Online</span>
                                    )}
                                </button>
                            );
                        })}
                        {filteredUsers.length === 0 && (
                            <p className={`text-center py-8 ${theme.sidebarText} text-sm opacity-60`}>
                                No users found
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Panel - Chat Area */}
            <div className={`${showMobileChat ? 'flex' : 'hidden md:flex'} flex-col flex-1 bg-white`}>
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        {(() => {
                            const other = getOtherParticipant(activeConversation);
                            if (!other) return null;
                            const isOnline = onlineUsers.includes(other._id);
                            return (
                                <div className={`${theme.headerBg} px-4 py-3 flex items-center gap-3 shadow-sm`}>
                                    <button
                                        onClick={handleBackToContacts}
                                        className="md:hidden text-white/70 hover:text-white transition-colors mr-1"
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                    <div className="relative flex-shrink-0">
                                        {other.image ? (
                                            <img src={other.image} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20" />
                                        ) : (
                                            <div className={`w-10 h-10 rounded-full ${theme.accentBg} flex items-center justify-center text-white text-sm font-bold`}>
                                                {getInitials(other.first_name, other.last_name)}
                                            </div>
                                        )}
                                        {isOnline && (
                                            <Circle size={10} className="absolute -bottom-0.5 -right-0.5 fill-emerald-400 text-emerald-400 stroke-gray-800" strokeWidth={3} />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold text-sm">
                                            {other.first_name} {other.last_name}
                                        </h3>
                                        <p className="text-white/60 text-xs">
                                            {typingUser ? (
                                                <span className="text-emerald-300 animate-pulse">typing...</span>
                                            ) : isOnline ? (
                                                'Online'
                                            ) : (
                                                'Offline'
                                            )}
                                        </p>
                                    </div>
                                    <div className="ml-auto">
                                        <span className={`inline-block px-2.5 py-1 text-[10px] font-semibold rounded-full capitalize ${
                                            other.role === 'admin'
                                                ? 'bg-amber-400/20 text-amber-300'
                                                : 'bg-white/10 text-white/70'
                                        }`}>
                                            {other.role}
                                        </span>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white custom-scrollbar">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className={`w-8 h-8 border-3 ${theme.accent} border-t-transparent rounded-full animate-spin`} style={{ borderWidth: '3px' }} />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <div className={`w-16 h-16 rounded-2xl ${theme.accentBg} bg-opacity-10 flex items-center justify-center mb-4`}>
                                        <MessageCircle size={28} className={theme.accent} />
                                    </div>
                                    <p className="text-sm font-medium">No messages yet</p>
                                    <p className="text-xs mt-1">Say hello to start the conversation! 👋</p>
                                </div>
                            ) : (
                                messages.map((msg, index) => {
                                    const senderId = typeof msg.sender === 'string' ? msg.sender : msg.sender._id;
                                    const isMine = senderId === currentUser?._id;
                                    const senderObj = typeof msg.sender === 'object' ? msg.sender : null;
                                    const showAvatar = !isMine && (index === 0 || (() => {
                                        const prevSenderId = typeof messages[index - 1].sender === 'string'
                                            ? messages[index - 1].sender
                                            : (messages[index - 1].sender as any)._id;
                                        return prevSenderId !== senderId;
                                    })());

                                    return (
                                        <div
                                            key={msg._id}
                                            className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}
                                        >
                                            {/* Avatar for received messages */}
                                            {!isMine && (
                                                <div className="flex-shrink-0 w-7">
                                                    {showAvatar && senderObj ? (
                                                        senderObj.image ? (
                                                            <img src={senderObj.image} alt="" className="w-7 h-7 rounded-full object-cover" />
                                                        ) : (
                                                            <div className={`w-7 h-7 rounded-full ${theme.accentBg} flex items-center justify-center text-white text-[10px] font-bold`}>
                                                                {getInitials(senderObj.first_name, senderObj.last_name)}
                                                            </div>
                                                        )
                                                    ) : null}
                                                </div>
                                            )}

                                            {/* Message Bubble */}
                                            <div className={`max-w-[70%] group`}>
                                                <div
                                                    className={`px-4 py-2.5 rounded-2xl ${
                                                        isMine
                                                            ? `${theme.sentBubble} ${theme.sentText} rounded-br-md`
                                                            : `${theme.receivedBubble} ${theme.receivedText} rounded-bl-md shadow-sm`
                                                    }`}
                                                >
                                                    <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                                                </div>
                                                <div className={`flex items-center gap-1 mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
                                                    <span className="text-[10px] text-gray-400">
                                                        {formatMessageTime(msg.createdAt)}
                                                    </span>
                                                    {isMine && (
                                                        msg.read ? (
                                                            <CheckCheck size={12} className="text-blue-500" />
                                                        ) : (
                                                            <Check size={12} className="text-gray-400" />
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}

                            {/* Typing Indicator */}
                            {typingUser && (
                                <div className="flex items-center gap-2">
                                    <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400">{getTypingUserName()} is typing</span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t border-gray-100 bg-white">
                            <div className="flex items-center gap-3">
                                <input
                                    ref={messageInputRef}
                                    type="text"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => {
                                        setNewMessage(e.target.value);
                                        handleTyping();
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    className={`flex-1 px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm transition-all ${theme.inputFocus} focus:ring-2`}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                    className={`${theme.accentBg} ${theme.accentHover} text-white p-3 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg active:scale-95`}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Empty State */
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 via-white to-gray-50">
                        <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${panelType === 'admin' ? 'from-emerald-50 to-emerald-100' : 'from-violet-50 to-violet-100'} flex items-center justify-center mb-6 shadow-inner`}>
                            <MessageCircle size={40} className={theme.accent} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">Welcome to Messages</h3>
                        <p className="text-sm text-gray-400 max-w-xs text-center leading-relaxed">
                            Select a person from the sidebar to start a conversation, or search for someone to connect with.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
