import { HttpStatusCode } from 'axios';
import AppError from '../../errors/appError';
import Category from './category.model';
import { TCategoryCreate } from './category.interface';

export default class CategoryService {
    static async createCategory(payload: TCategoryCreate): Promise<any> {
        const newCategory = await Category.create(payload as any);
        if (!newCategory) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed',
                'Failed to create category. Please try again.',
            );
        }
        return newCategory;
    }

    static async updateCategory(_id: string, update: Partial<TCategoryCreate>): Promise<any> {
        const options = { new: true };
        const category = await Category.findByIdAndUpdate(_id, update as any, options).lean();
        if (!category) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'Category not found!',
            );
        }
        return category;
    }

    static async deleteCategory(_id: string): Promise<any> {
        const category = await Category.findByIdAndUpdate(_id, { is_deleted: true }, { new: true }).lean();
        if (!category) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'Category not found!',
            );
        }
        return category;
    }

    static async listCategories(filter: any = {}, query: any = {}): Promise<any> {
        const aggregate = Category.aggregate([
            { $match: { ...filter, is_deleted: false } },
            { $project: { name: 1, slug: 1, description: 1, createdAt: 1 } },
        ]);
        const options = {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
        };
        const list = await (Category as any).aggregatePaginate(aggregate, options);
        return list;
    }
}
