import { Types } from 'mongoose';

export type TCategory = {
    name: string;
    slug?: string;
    is_deleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};

export type TCategoryCreate = {
    name: string;
    slug?: string;
};
