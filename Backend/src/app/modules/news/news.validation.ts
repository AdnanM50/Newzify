import { z } from 'zod';

const createNewsSchema = z.object({
    body: z.object({
        title: z.string().min(3, { message: 'Title is required' }),
        slug: z.string().optional(),
        content: z.string().min(1, { message: 'Content is required' }),
        image: z.string().optional(),
        cover_image: z.string().optional(),
        category: z.string().optional(),
        types: z.array(z.enum(['trending','latest','popular','fresh','top'] as const)).optional(),
        status: z.enum(['draft', 'published']).optional(),
    }),
});
const updateNewsSchema = z.object({
    body: z.object({
        _id: z.string().min(1),
        title: z.string().optional(),
        slug: z.string().optional(),
        content: z.string().optional(),
        image: z.string().optional(),
        cover_image: z.string().optional(),
        category: z.string().optional(),
        types: z.array(z.enum(['trending','latest','popular','fresh','top'] as const)).optional(),
        status: z.enum(['draft', 'published']).optional(),
    }),
});

const deleteNewsSchema = z.object({
    body: z.object({
        _id: z.string().min(1),
    }),
});

export const NewsValidation = {
    createNewsSchema,
    updateNewsSchema,
    deleteNewsSchema,
};

