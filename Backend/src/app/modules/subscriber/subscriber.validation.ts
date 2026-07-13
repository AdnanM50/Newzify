import { z } from 'zod';

const subscribeSchema = z.object({
    body: z.object({
        email: z.string().email({ message: 'Please provide a valid email address' }),
    }),
});

const subscriberListSchema = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        search: z.string().optional(),
    }).partial(),
});

export const SubscriberValidation = {
    subscribeSchema,
    subscriberListSchema,
};
