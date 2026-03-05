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
        const news = await News.findById(_id).populate('author', 'first_name last_name role image').lean();
        if (!news) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'News not found!',
            );
        }
        return news;
    }

    static async toggleLikeNews(_id: string, userId: string): Promise<any> {
        const news = await News.findById(_id);
        if (!news) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'News not found!',
            );
        }

        const isLiked = news.likes?.includes(userId as any);
        if (isLiked) {
            // Unlike
            news.likes = news.likes?.filter((id: any) => String(id) !== String(userId));
        } else {
            // Like
            news.likes?.push(userId as any);
        }

        await news.save();
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
        const pipeline: any[] = [
            { $match: filter }
        ];

        pipeline.push({
            $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category',
            },
        });
        pipeline.push({ $unwind: { path: '$category', preserveNullAndEmptyArrays: true } });

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
                content: 1,
                image: 1,
                category: { _id: '$category._id', name: '$category.name', slug: '$category.slug' },
                types: 1,
                status: 1,
                author: { _id: '$author._id', first_name: '$author.first_name', last_name: '$author.last_name', role: '$author.role' },
                createdAt: 1,
            },
        });

        const aggregate = News.aggregate(pipeline);
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
