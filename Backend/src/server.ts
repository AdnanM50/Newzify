import connectMongo from './app/config/database';
import config from './app/config';
import { app } from './app';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from './app/modules/user/user.model';

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// Track online users: Map<userId, Set<socketId>>
const onlineUsers = new Map<string, Set<string>>();

// Socket.IO JWT Authentication Middleware
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }
        const decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
        if (!decoded?._id) {
            return next(new Error('Authentication error: Invalid token'));
        }
        const user = await User.findById(decoded._id)
            .select('first_name last_name image role email')
            .lean();
        if (!user) {
            return next(new Error('Authentication error: User not found'));
        }
        socket.data.user = user;
        next();
    } catch (error) {
        next(new Error('Authentication error: Invalid token'));
    }
});

// Socket.IO Event Handlers
io.on('connection', (socket) => {
    const userId = String(socket.data.user._id);
    console.log(`User connected: ${socket.data.user.first_name} (${userId})`);

    // Add to online users
    if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId)!.add(socket.id);

    // Broadcast online status
    io.emit('user_online', { userId });

    // Send current online users list to the newly connected socket
    const onlineUserIds = Array.from(onlineUsers.keys());
    socket.emit('online_users', onlineUserIds);

    // Join conversation room
    socket.on('join_conversation', (conversationId: string) => {
        socket.join(`conversation:${conversationId}`);
    });

    // Leave conversation room
    socket.on('leave_conversation', (conversationId: string) => {
        socket.leave(`conversation:${conversationId}`);
    });

    // Handle new message (real-time broadcast)
    socket.on('send_message', (data: { conversationId: string; message: any }) => {
        // Broadcast to everyone in the conversation room except sender
        socket.to(`conversation:${data.conversationId}`).emit('new_message', data.message);
        // Also emit a global notification for unread count updates
        socket.broadcast.emit('message_notification', {
            conversationId: data.conversationId,
            message: data.message,
        });
    });

    // Typing indicators
    socket.on('typing', (data: { conversationId: string }) => {
        socket.to(`conversation:${data.conversationId}`).emit('typing', {
            userId,
            conversationId: data.conversationId,
        });
    });

    socket.on('stop_typing', (data: { conversationId: string }) => {
        socket.to(`conversation:${data.conversationId}`).emit('stop_typing', {
            userId,
            conversationId: data.conversationId,
        });
    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.data.user.first_name} (${userId})`);
        const userSockets = onlineUsers.get(userId);
        if (userSockets) {
            userSockets.delete(socket.id);
            if (userSockets.size === 0) {
                onlineUsers.delete(userId);
                io.emit('user_offline', { userId });
            }
        }
    });
});

async function main(): Promise<void> {
    try {
        await connectMongo(config.db_string as string);
        const PORT = config.port;
        httpServer.listen(PORT, () => console.log(`Listening on ${PORT}`));
    } catch (error) {
        console.error(error);
    }
}

(async (): Promise<void> => {
    await main();
})();

process
    .on('uncaughtException', (error: Record<string, any>) => {
        console.log('uncaughtException is detected , shutting down ...');
        console.log(error.name + ': ' + error.message);
        process.exit(1);
    })
    .on('unhandledRejection', (error: Record<string, any>) => {
        console.log('unhandledRejection is detected , shutting down ...');
        console.log(error.name + ': ' + error.message);
        process.exit(1);
    });

export { io };