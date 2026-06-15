import { Types } from 'mongoose';

export type TPodcast = {
    title: string;
    slug?: string;
    description: string;
    image?: string;
    embed_code?: string;
    audio_url?: string;
    category?: string;
    author?: Types.ObjectId | any;
    status?: 'draft' | 'published';
    is_featured?: boolean;
    is_deleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};

export type TPodcastCreate = {
    title: string;
    slug?: string;
    description: string;
    image?: string;
    embed_code?: string;
    audio_url?: string;
    category?: string;
    status?: 'draft' | 'published';
    is_featured?: boolean;
};
