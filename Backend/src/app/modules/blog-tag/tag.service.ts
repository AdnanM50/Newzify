import { HttpStatusCode } from 'axios';
import AppError from '../../errors/appError';
import Tag from './tag.model';
import { TTagCreate } from './tag.interface';

export default class TagService {
    static async createTag(payload: TTagCreate): Promise<any> {
        const newTag = await Tag.create(payload);
        if (!newTag) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed',
                'Failed to create tag. Please try again.',
            );
        }
        return newTag;
    }

    static async findById(_id: string): Promise<any> {
        const tag = await Tag.findById(_id).lean();
        if (!tag) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'Tag not found!',
            );
        }
        return tag;
    }

    static async updateTag(_id: string, updateDocument: any): Promise<any> {
        const options = { new: true };
        const tag = await Tag.findByIdAndUpdate(_id, updateDocument, options).lean();
        if (!tag) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'Tag not found!',
            );
        }
        return tag;
    }

    static async listTags(filter: any = {}, query: any = {}): Promise<any> {
        const aggregate = Tag.aggregate([
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
        const list = await (Tag as any).aggregatePaginate(aggregate, options);
        return list;
    }

    static async deleteTag(_id: string): Promise<any> {
        const tag = await Tag.findByIdAndUpdate(_id, { is_deleted: true }, { new: true }).lean();
        if (!tag) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'Tag not found!',
            );
        }
        return tag;
    }
}
