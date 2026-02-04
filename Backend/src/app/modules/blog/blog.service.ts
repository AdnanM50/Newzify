import { HttpStatusCode } from 'axios';
import AppError from '../../errors/appError';
import Blog from './blog.model';
import { TBlogCreate } from './blog.interface';

export default class BlogService {
    static async createBlog(payload: TBlogCreate): Promise<any> {
        const newBlog = await Blog.create(payload);
        if (!newBlog) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed',
                'Failed to create blog. Please try again.',
            );
        }
        return newBlog;
    }

    static async findById(_id: string): Promise<any> {
        const blog = await Blog.findById(_id)
            .populate('category')
            .populate('tags')
            .lean();
        if (!blog) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'Blog not found!',
            );
        }
        return blog;
    }

    static async updateBlog(_id: string, updateDocument: any): Promise<any> {
        const options = { new: true };
        const blog = await Blog.findByIdAndUpdate(_id, updateDocument, options)
            .populate('category')
            .populate('tags')
            .lean();
        if (!blog) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'Blog not found!',
            );
        }
        return blog;
    }

    static async listBlogs(filter: any = {}, query: any = {}): Promise<any> {
        const aggregate = Blog.aggregate([
            { $match: { ...filter, is_deleted: false } },
            {
                $lookup: {
                    from: 'blog-categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'tags',
                    localField: 'tags',
                    foreignField: '_id',
                    as: 'tags',
                },
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    image: 1,
                    category: 1,
                    tags: 1,
                    slug: 1,
                    createdAt: 1,
                },
            },
        ]);
        const options = {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
        };
        const list = await (Blog as any).aggregatePaginate(aggregate, options);
        return list;
    }

    static async deleteBlog(_id: string): Promise<any> {
        const blog = await Blog.findByIdAndUpdate(_id, { is_deleted: true }, { new: true }).lean();
        if (!blog) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'Blog not found!',
            );
        }
        return blog;
    }
}
