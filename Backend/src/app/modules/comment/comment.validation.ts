import { z } from "zod";

const createCommentSchema = z.object({
    body: z.object({
        content: z.string().min(1, "Content is required"),
        newsId: z.string().min(1, "News ID is required"),
        parentCommentId: z.string().optional(),
    }),
});

const updateCommentSchema = z.object({
    body: z.object({
        content: z.string().min(1, "Content is required").optional(),
    }),
});

export const CommentValidation = {
    createCommentSchema,
    updateCommentSchema,
};
