import BlogCategory from './blog-category.model';
import { HttpStatusCode } from 'axios';
import { Types } from 'mongoose';
import AppError from "../../errors/appError";

export class BlogCategoryService {
    static async postBlogCategoryies(payload: any) {
        const data = await BlogCategory.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Can not create new blog category ! please try again',
            );
        }
        return data;
    }
    static async findBlogCategoryById(_id: string | Types.ObjectId) {
        const data = await BlogCategory.findById(_id).select(
            '-updatedAt -__v -is_deleted',
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Blog category not found.',
            );
        }
        return data;
    }
    static async findBlogCategoryByQuery(
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await BlogCategory.findOne(query).select(
            '-updatedAt -__v -is_deleted',
        );
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Blog tag not found.',
            );
        }
        return data;
    }
    static async findBlogCategoryListByQuery(
        filter: any,
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const aggregate = BlogCategory.aggregate([
            {
                $match: filter,
            },
            {
                $project: {
                    is_deleted: 0,
                    __v: 0,
                    updatedAt: 0,
                },
            },
        ]);
        const options = {
            page: +query.page || 1,
            limit: +query.limit || 10,
            sort: { createdAt: -1 },
        };
        const data = await BlogCategory.aggregatePaginate(aggregate, options);
        if (!data.docs.length && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Blog category not found.',
            );
        }
        return data;
    }
    static async updateBlogCategoryByQuery(
        query: Record<string, string | boolean | number>,
        updatedDocument: Record<string, string | boolean | number>,
        section = undefined,
    ) {
        const options = {
            section,
            new: true,
        };
        const data = await BlogCategory.findOneAndUpdate(
            query,
            updatedDocument,
            options,
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Can not update  blog category ! please try again',
            );
        }
        return data;
    }
    static async deleteBlogCategoryById(_id: string | Types.ObjectId) {
        const data = await BlogCategory.findByIdAndUpdate(_id, {
            is_deleted: true,
        }).select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Blog tag not found.',
            );
        }
        return data;
    }
}
