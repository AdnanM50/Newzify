import { Types } from 'mongoose';

export type TEditorial = {
    title: string;
    slug?: string;
    subtitle?: string;
    content: string;
    image?: string;
    category?: string;
    author?: Types.ObjectId | any;
    status?: 'draft' | 'published';
    is_editors_pick?: boolean;
    is_deleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};

export type TEditorialCreate = {
    title: string;
    slug?: string;
    subtitle?: string;
    content: string;
    image?: string;
    category?: string;
    status?: 'draft' | 'published';
    is_editors_pick?: boolean;
};
