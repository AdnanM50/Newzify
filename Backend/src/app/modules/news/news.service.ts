import { HttpStatusCode } from 'axios';
import AppError from '../../errors/appError';
import News from './news.model';
import { TNewsCreate } from './news.interface';

export default class NewsService {
    static async createNews(payload: TNewsCreate): Promise<any> {
        const newNews = await News.create(payload as any);
        if (!newNews) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed',
                'Failed to create news. Please try again.',
            );
        }
        return newNews;
    }

    static async findById(_id: string): Promise<any> {
        const news = await News.findById(_id).lean();
        if (!news) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'News not found!',
            );
        }
        return news;
    }
    static async updateNews(_id: string, updateDocument: any): Promise<any> {
        const options = { new: true };
        const news = await News.findByIdAndUpdate(_id, updateDocument, options).lean();
        if (!news) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'News not found!',
            );
        }
        return news;
    }
    static async listNews(filter: any = {}, query: any = {}): Promise<any> {
        const aggregate = News.aggregate([
            { $match: filter },
            {
                $lookup: {
                    from: 'user',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                },
            },
            { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    title: 1,
                    slug: 1,
                    content: 1,
                    image: 1,
                    category: 1,
                    types: 1,
                    status: 1,
                    author: { _id: '$author._id', first_name: '$author.first_name', last_name: '$author.last_name' },
                    createdAt: 1,
                },
            },
        ]);
        const options = {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
        };
        const list = await (News as any).aggregatePaginate(aggregate, options);
        return list;
    }

    static async deleteNews(_id: string): Promise<any> {
        const news = await News.findByIdAndUpdate(_id, { is_deleted: true }, { new: true }).lean();
        if (!news) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'News not found!',
            );
        }
        return news;
    }
}
