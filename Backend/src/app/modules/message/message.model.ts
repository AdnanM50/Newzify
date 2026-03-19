import { model, Schema } from "mongoose";
import { TMessage } from "./message.interface";

const schema = new Schema<TMessage>(
    {
        conversation: {
            type: Schema.Types.ObjectId,
            ref: "conversation",
            required: true,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for fetching messages in a conversation
schema.index({ conversation: 1, createdAt: -1 });
schema.index({ sender: 1 });

const Message = model<TMessage>("message", schema);
export default Message;
