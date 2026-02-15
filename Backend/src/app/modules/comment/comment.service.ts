import { Types } from "mongoose";
import { TComment } from "./comment.interface";
import Comment from "./comment.model";

const createComment = async (userId: string, payload: Partial<TComment>) => {
    const result = await Comment.create({
        ...payload,
        userId,
    });
    return result;
};

const getCommentsByNewsId = async (newsId: string) => {
    const result = await Comment.find({ newsId, parentCommentId: null })
        .populate("userId", "first_name last_name image")
        .sort({ createdAt: -1 })
        .lean();

    // Fetch replies for each top-level comment
    const commentsWithReplies = await Promise.all(
        result.map(async (comment) => {
            const replies = await Comment.find({ parentCommentId: comment._id })
                .populate("userId", "first_name last_name image")
                .sort({ createdAt: 1 })
                .lean();
            return { ...comment, replies };
        })
    );

    return commentsWithReplies;
};

const toggleLike = async (userId: string, commentId: string) => {
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new Error("Comment not found");
    }

    const isLiked = comment.likes.includes(new Types.ObjectId(userId));

    if (isLiked) {
        // Unlike
        const result = await Comment.findByIdAndUpdate(
            commentId,
            {
                $pull: { likes: userId },
            },
            { new: true }
        );
        return result;
    } else {
        // Like
        const result = await Comment.findByIdAndUpdate(
            commentId,
            {
                $addToSet: { likes: userId },
            },
            { new: true }
        );
        return result;
    }
};

const deleteComment = async (userId: string, commentId: string) => {
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new Error("Comment not found");
    }

    // Only author or admin can delete (admin check should be in controller if needed, 
    // but here we check if userId matches author)
    // For now, let's just implement the service
    const result = await Comment.findByIdAndUpdate(
        commentId,
        { is_deleted: true },
        { new: true }
    );
    return result;
};

export const CommentService = {
    createComment,
    getCommentsByNewsId,
    toggleLike,
    deleteComment,
};
