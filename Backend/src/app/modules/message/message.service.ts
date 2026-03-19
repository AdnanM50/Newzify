import Message from "./message.model";
import ConversationService from "../conversation/conversation.service";
import { Types } from "mongoose";

class MessageService {
    static async sendMessage(
        conversationId: string,
        senderId: string,
        content: string
    ) {
        const message = await Message.create({
            conversation: new Types.ObjectId(conversationId),
            sender: new Types.ObjectId(senderId),
            content,
        });

        // Update conversation's lastMessage
        await ConversationService.updateLastMessage(
            conversationId,
            message._id
        );

        // Populate sender info before returning
        const populated = await Message.findById(message._id)
            .populate("sender", "first_name last_name image role")
            .lean();

        return populated;
    }

    static async getMessages(
        conversationId: string,
        page: number = 1,
        limit: number = 50
    ) {
        const skip = (page - 1) * limit;
        const messages = await Message.find({
            conversation: new Types.ObjectId(conversationId),
        })
            .populate("sender", "first_name last_name image role")
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Message.countDocuments({
            conversation: new Types.ObjectId(conversationId),
        });

        return {
            messages,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    static async markAsRead(conversationId: string, userId: string) {
        await Message.updateMany(
            {
                conversation: new Types.ObjectId(conversationId),
                sender: { $ne: new Types.ObjectId(userId) },
                read: false,
            },
            { read: true }
        );
    }

    static async getUnreadCount(userId: string) {
        // Get all conversations for this user
        const conversations =
            await ConversationService.getUserConversations(userId);
        const conversationIds = conversations.map((c: any) => c._id);

        const count = await Message.countDocuments({
            conversation: { $in: conversationIds },
            sender: { $ne: new Types.ObjectId(userId) },
            read: false,
        });

        return count;
    }
}

export default MessageService;
