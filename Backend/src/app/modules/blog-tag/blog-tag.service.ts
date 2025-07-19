import { Types } from 'mongoose';
import Tag from './blog-tag.model';
import { HttpStatusCode } from 'axios';
import AppError from "../../errors/appError";
export class BlogTagService {
    static async postBlogTags(payload: any) {
        const blog = await Tag.create(payload);
        if (!blog) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Can not create new blog tag ! please try again',
            );
        }
        return blog;
    }
    static async findBlogTagById(_id: string | Types.ObjectId) {
        const blog = await Tag.findById(_id).select(
            '-updatedAt -__v -is_deleted',
        );
        if (!blog) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Blog tag not found.',
            );
        }
        return blog;
    }
    static async findBlogTagByQuery(
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const blog = await Tag.findOne(query).select(
            '-updatedAt -__v -is_deleted',
        );
        if (!blog && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Blog tag not found.',
            );
        }
        return blog;
    }
    static async findBlogTagListByQuery(
        filter: any,
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const aggregate = Tag.aggregate([
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
        const blog = await Tag.aggregatePaginate(aggregate, options);
        if (!blog.docs.length && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Blog tag not found.',
            );
        }
        return blog;
    }
    static async updateBlogTagByQuery(
        query: Record<string, string | boolean | number>,
        updatedDocument: Record<string, string | boolean | number>,
        section = undefined,
    ) {
        const options = {
            section,
            new: true,
        };
        const blog = await Tag.findOneAndUpdate(
            query,
            updatedDocument,
            options,
        );
        if (!blog) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Can not update  blog tag ! please try again',
            );
        }
        return blog;
    }
    static async deleteBlogTagById(_id: string | Types.ObjectId) {
        const blog = await Tag.findByIdAndUpdate(_id, {
            is_deleted: true,
        }).select('-updatedAt -__v');
        if (!blog) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Blog tag not found.',
            );
        }
        return blog;
    }
}
