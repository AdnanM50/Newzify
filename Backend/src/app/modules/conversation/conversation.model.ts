import { model, Schema } from "mongoose";
import { TConversation } from "./conversation.interface";

const schema = new Schema<TConversation>(
    {
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: "user",
                required: true,
            },
        ],
        lastMessage: {
            type: Schema.Types.ObjectId,
            ref: "message",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Index for fast lookup of user conversations
schema.index({ participants: 1 });
schema.index({ updatedAt: -1 });

const Conversation = model<TConversation>("conversation", schema);
export default Conversation;
