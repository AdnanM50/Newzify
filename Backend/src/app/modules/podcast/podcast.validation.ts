import { z } from 'zod';

const createPodcastSchema = z.object({
    body: z.object({
        title: z.string().min(3, { message: 'Title is required' }),
        slug: z.string().optional(),
        description: z.string().min(1, { message: 'Description is required' }),
        image: z.string().optional(),
        embed_code: z.string().optional(),
        audio_url: z.string().optional(),
        category: z.enum(['in-focus', 'the-rearview', 'daily-news', 'interviews', 'specials']).optional(),
        status: z.enum(['draft', 'published']).optional(),
        is_featured: z.boolean().optional(),
    }).refine((body) => Boolean(body.embed_code?.trim() || body.audio_url?.trim()), {
        message: 'Upload audio or add an embed code',
        path: ['audio_url'],
    }),
});

const updatePodcastSchema = z.object({
    body: z.object({
        _id: z.string().min(1),
        title: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
        embed_code: z.string().optional(),
        audio_url: z.string().optional(),
        category: z.enum(['in-focus', 'the-rearview', 'daily-news', 'interviews', 'specials']).optional(),
        status: z.enum(['draft', 'published']).optional(),
        is_featured: z.boolean().optional(),
    }),
});

const deletePodcastSchema = z.object({
    body: z.object({
        _id: z.string().min(1),
    }),
});

export const PodcastValidation = {
    createPodcastSchema,
    updatePodcastSchema,
    deletePodcastSchema,
};
