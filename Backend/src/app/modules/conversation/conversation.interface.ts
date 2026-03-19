import { Types } from "mongoose";

export type TConversation = {
    participants: Types.ObjectId[];
    lastMessage?: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
};
