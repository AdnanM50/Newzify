import { Types } from 'mongoose';

export type TBlog = {
    title: string;
    description: string;
    image?: string;
    category: Types.ObjectId | any;
    tags: Array<Types.ObjectId | any>;
    slug?: string;
    is_deleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};

export type TBlogCreate = {
    title: string;
    description: string;
    image?: string;
    category: string;
    tags: string[];
    slug?: string;
};
