import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { BACKEND_URL } from '../helpers/api';

interface SocketContextType {
    socket: Socket | null;
    onlineUsers: string[];
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    onlineUsers: [],
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const newSocket = io(BACKEND_URL, {
            auth: { token },
            transports: ['websocket', 'polling'],
        });

        newSocket.on('connect', () => {
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
        });

        newSocket.on('online_users', (userIds: string[]) => {
            setOnlineUsers(userIds);
        });

        newSocket.on('user_online', ({ userId }: { userId: string }) => {
            setOnlineUsers((prev) => {
                if (prev.includes(userId)) return prev;
                return [...prev, userId];
            });
        });

        newSocket.on('user_offline', ({ userId }: { userId: string }) => {
            setOnlineUsers((prev) => prev.filter((id) => id !== userId));
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
}
