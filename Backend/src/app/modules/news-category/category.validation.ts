import { z } from 'zod';

const createCategorySchema = z.object({
    body: z.object({
        name: z.string().min(2, { message: 'Name is required' }),
        slug: z.string().optional(),
        description: z.string().optional(),
    }),
});

const updateCategorySchema = z.object({
    body: z.object({
        _id: z.string().min(1),
        name: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
    }),
});

const deleteCategorySchema = z.object({
    body: z.object({
        _id: z.string().min(1),
    }),
});

export const CategoryValidation = {
    createCategorySchema,
    updateCategorySchema,
    deleteCategorySchema,
};
