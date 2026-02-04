import { z } from 'zod';

const createBlogSchema = z.object({
    body: z.object({
        title: z.string().min(1, { message: 'Title is required' }),
        description: z.string().min(1, { message: 'Description is required' }),
        image: z.string().optional(),
        category: z.string().min(1, { message: 'Category is required' }),
        tags: z.array(z.string()).optional(),
        slug: z.string().optional(),
    }),
});

const updateBlogSchema = z.object({
    body: z.object({
        _id: z.string().min(1),
        title: z.string().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        slug: z.string().optional(),
    }),
});

const deleteBlogSchema = z.object({
    body: z.object({
        _id: z.string().min(1),
    }),
});

export const BlogValidation = {
    createBlogSchema,
    updateBlogSchema,
    deleteBlogSchema,
};
