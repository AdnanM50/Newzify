import { HttpStatusCode } from 'axios';
import AppError from '../../errors/appError';
import BlogCategory from './category.model';
import { TBlogCategoryCreate } from './category.interface';

export default class BlogCategoryService {
    static async createCategory(payload: any): Promise<any> {
        const newCategory = await BlogCategory.create(payload);
        if (!newCategory) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed',
                'Failed to create blog category. Please try again.',
            );
        }
        return newCategory;
    }

    static async findById(_id: string): Promise<any> {
        const category = await BlogCategory.findById(_id).lean();
        if (!category) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'Blog category not found!',
            );
        }
        return category;
    }

    static async updateCategory(_id: string, updateDocument: any): Promise<any> {
        const options = { new: true };
        const category = await BlogCategory.findByIdAndUpdate(_id, updateDocument, options).lean();
        if (!category) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'Blog category not found!',
            );
        }
        return category;
    }

    static async listCategories(filter: any = {}, query: any = {}): Promise<any> {
        const aggregate = BlogCategory.aggregate([
            { $match: { ...filter, is_deleted: false } },
            {
                $project: {
                    name: 1,
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
        const list = await (BlogCategory as any).aggregatePaginate(aggregate, options);
        return list;
    }

    static async deleteCategory(_id: string): Promise<any> {
        const category = await BlogCategory.findByIdAndUpdate(_id, { is_deleted: true }, { new: true }).lean();
        if (!category) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'Blog category not found!',
            );
        }
        return category;
    }
}
