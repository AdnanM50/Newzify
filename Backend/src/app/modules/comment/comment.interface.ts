import { Types } from "mongoose";

export type TComment = {
    content: string;
    newsId: Types.ObjectId;
    userId: Types.ObjectId;
    parentCommentId?: Types.ObjectId;
    likes: Types.ObjectId[];
    is_deleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};
