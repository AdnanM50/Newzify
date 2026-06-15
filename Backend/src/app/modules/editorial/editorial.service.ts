import { HttpStatusCode } from 'axios';
import AppError from '../../errors/appError';
import Editorial from './editorial.model';
import { TEditorialCreate } from './editorial.interface';
import { deleteImageFromCloudinary } from '../../utils/cloudinary.helper';

export default class EditorialService {
    static async createEditorial(payload: TEditorialCreate): Promise<any> {
        const newEditorial = await Editorial.create(payload as any);
        if (!newEditorial) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed',
                'Failed to create editorial. Please try again.',
            );
        }
        return newEditorial;
    }

    static async findById(_id: string): Promise<any> {
        const editorial = await Editorial.findById(_id).populate('author', 'first_name last_name role image').lean();
        if (!editorial) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'Editorial not found!',
            );
        }
        return editorial;
    }

    static async updateEditorial(_id: string, updateDocument: any): Promise<any> {
        const oldEditorial = await Editorial.findById(_id).select('image').lean();
        const options = { new: true };
        const editorial = await Editorial.findByIdAndUpdate(_id, updateDocument, options).lean();
        if (!editorial) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'Editorial not found!',
            );
        }

        if (oldEditorial && oldEditorial.image && updateDocument.image && oldEditorial.image !== updateDocument.image) {
            await deleteImageFromCloudinary(oldEditorial.image as string);
        }

        return editorial;
    }

    static async listEditorials(filter: any = {}, query: any = {}): Promise<any> {
        const pipeline: any[] = [
            { $match: filter }
        ];

        pipeline.push({
            $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'author',
            },
        });
        pipeline.push({ $unwind: { path: '$author', preserveNullAndEmptyArrays: true } });

        if (query.author_role) {
            pipeline.push({ $match: { 'author.role': query.author_role } });
        }

        pipeline.push({
            $project: {
                title: 1,
                slug: 1,
                subtitle: 1,
                content: 1,
                image: 1,
                category: 1,
                status: 1,
                is_editors_pick: 1,
                author: { _id: '$author._id', first_name: '$author.first_name', last_name: '$author.last_name', role: '$author.role', image: '$author.image' },
                createdAt: 1,
                updatedAt: 1,
            },
        });

        const aggregate = Editorial.aggregate(pipeline);
        const options = {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
        };
        const list = await (Editorial as any).aggregatePaginate(aggregate, options);
        return list;
    }

    static async deleteEditorial(_id: string): Promise<any> {
        const editorial = await Editorial.findByIdAndUpdate(_id, { is_deleted: true }, { new: true }).lean();
        if (!editorial) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'Editorial not found!',
            );
        }

        if (editorial.image) {
            await deleteImageFromCloudinary(editorial.image as string);
        }

        return editorial;
    }
}
