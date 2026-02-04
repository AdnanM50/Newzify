export type TBlogCategory = {
    name: string;
    slug?: string;
    description?: string;
    is_deleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};

export type TBlogCategoryCreate = {
    name: string;
    slug?: string;
    description?: string;
};
