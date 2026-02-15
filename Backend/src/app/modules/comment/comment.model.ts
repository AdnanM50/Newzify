import { Schema, model } from "mongoose";
import { TComment } from "./comment.interface";

const commentSchema = new Schema<TComment>(
    {
        content: {
            type: String,
            required: true,
        },
        newsId: {
            type: Schema.Types.ObjectId,
            ref: "news",
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        parentCommentId: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
            default: null,
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: "user",
            },
        ],
        is_deleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Filter out deleted comments by default
commentSchema.pre("find", function (next) {
    this.find({ is_deleted: { $ne: true } });
    next();
});

commentSchema.pre("findOne", function (next) {
    this.find({ is_deleted: { $ne: true } });
    next();
});

const Comment = model<TComment>("Comment", commentSchema);

export default Comment;
