export type TTag = {
    name: string;
    slug?: string;
    is_deleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};

export type TTagCreate = {
    name: string;
    slug?: string;
};
