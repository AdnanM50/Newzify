import { z } from 'zod';

const createEditorialSchema = z.object({
    body: z.object({
        title: z.string().min(3, { message: 'Title is required' }),
        slug: z.string().optional(),
        subtitle: z.string().optional(),
        content: z.string().min(1, { message: 'Content is required' }),
        image: z.string().optional(),
        category: z.enum(['editorial', 'big-picture', 'views', 'opinion', 'geopolitical-insights']).optional(),
        status: z.enum(['draft', 'published']).optional(),
        is_editors_pick: z.boolean().optional(),
    }),
});

const updateEditorialSchema = z.object({
    body: z.object({
        _id: z.string().min(1),
        title: z.string().optional(),
        slug: z.string().optional(),
        subtitle: z.string().optional(),
        content: z.string().optional(),
        image: z.string().optional(),
        category: z.enum(['editorial', 'big-picture', 'views', 'opinion', 'geopolitical-insights']).optional(),
        status: z.enum(['draft', 'published']).optional(),
        is_editors_pick: z.boolean().optional(),
    }),
});

const deleteEditorialSchema = z.object({
    body: z.object({
        _id: z.string().min(1),
    }),
});

export const EditorialValidation = {
    createEditorialSchema,
    updateEditorialSchema,
    deleteEditorialSchema,
};
