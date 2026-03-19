import { Types } from "mongoose";

export type TMessage = {
    conversation: Types.ObjectId;
    sender: Types.ObjectId;
    content: string;
    read: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};
