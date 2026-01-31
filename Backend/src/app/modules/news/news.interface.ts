import { Types } from 'mongoose';

export type TNews = {
    title: string;
    slug?: string;
    content: string;
    image?: string;
    cover_image?: string;
    category?: Types.ObjectId | any;
    types?: Array<'trending' | 'latest' | 'popular' | 'fresh' | 'top'>;
    author?: Types.ObjectId | any;
    status?: 'draft' | 'published';
    is_deleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};

export type TNewsCreate = {
    title: string;
    slug?: string;
    content: string;
    image?: string;
    cover_image?: string;
    category?: string;
    types?: Array<'trending' | 'latest' | 'popular' | 'fresh' | 'top'>;
    status?: 'draft' | 'published';
};
