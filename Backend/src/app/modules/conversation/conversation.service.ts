import Conversation from "./conversation.model";
import { Types } from "mongoose";

class ConversationService {
    static async getOrCreateConversation(userId1: string, userId2: string) {
        // Find existing conversation between these two users
        let conversation = await Conversation.findOne({
            participants: {
                $all: [
                    new Types.ObjectId(userId1),
                    new Types.ObjectId(userId2),
                ],
            },
        })
            .populate("participants", "first_name last_name image role email")
            .populate({
                path: "lastMessage",
                select: "content sender createdAt read",
            })
            .lean();

        if (!conversation) {
            const created = await Conversation.create({
                participants: [
                    new Types.ObjectId(userId1),
                    new Types.ObjectId(userId2),
                ],
            });
            conversation = await Conversation.findById(created._id)
                .populate(
                    "participants",
                    "first_name last_name image role email"
                )
                .lean();
        }

        return conversation;
    }

    static async getUserConversations(userId: string) {
        const conversations = await Conversation.find({
            participants: new Types.ObjectId(userId),
        })
            .populate("participants", "first_name last_name image role email")
            .populate({
                path: "lastMessage",
                select: "content sender createdAt read",
            })
            .sort({ updatedAt: -1 })
            .lean();

        return conversations;
    }

    static async updateLastMessage(
        conversationId: string,
        messageId: Types.ObjectId
    ) {
        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: messageId,
        });
    }
}

export default ConversationService;
