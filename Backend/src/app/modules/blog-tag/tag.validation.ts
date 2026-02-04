import { z } from 'zod';

const createTagSchema = z.object({
    body: z.object({
        name: z.string().min(1, { message: 'Name is required' }),
        slug: z.string().optional(),
    }),
});

const updateTagSchema = z.object({
    body: z.object({
        _id: z.string().min(1),
        name: z.string().optional(),
        slug: z.string().optional(),
    }),
});

const deleteTagSchema = z.object({
    body: z.object({
        _id: z.string().min(1),
    }),
});

export const TagValidation = {
    createTagSchema,
    updateTagSchema,
    deleteTagSchema,
};
