import { HttpStatusCode } from 'axios';
import AppError from '../../errors/appError';
import Podcast from './podcast.model';
import { TPodcastCreate } from './podcast.interface';
import { deleteImageFromCloudinary } from '../../utils/cloudinary.helper';

export default class PodcastService {
    static async createPodcast(payload: TPodcastCreate): Promise<any> {
        const newPodcast = await Podcast.create(payload as any);
        if (!newPodcast) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed',
                'Failed to create podcast. Please try again.',
            );
        }
        return newPodcast;
    }

    static async findById(_id: string): Promise<any> {
        const podcast = await Podcast.findById(_id).populate('author', 'first_name last_name role image').lean();
        if (!podcast) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'Podcast not found!',
            );
        }
        return podcast;
    }

    static async updatePodcast(_id: string, updateDocument: any): Promise<any> {
        const oldPodcast = await Podcast.findById(_id).select('image audio_url').lean();
        const options = { new: true };
        const podcast = await Podcast.findByIdAndUpdate(_id, updateDocument, options).lean();
        if (!podcast) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'Podcast not found!',
            );
        }

        if (oldPodcast && oldPodcast.image && updateDocument.image && oldPodcast.image !== updateDocument.image) {
            await deleteImageFromCloudinary(oldPodcast.image as string);
        }

        return podcast;
    }

    static async listPodcasts(filter: any = {}, query: any = {}): Promise<any> {
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
                description: 1,
                image: 1,
                embed_code: 1,
                audio_url: 1,
                category: 1,
                status: 1,
                is_featured: 1,
                author: { _id: '$author._id', first_name: '$author.first_name', last_name: '$author.last_name', role: '$author.role', image: '$author.image' },
                createdAt: 1,
                updatedAt: 1,
            },
        });

        const aggregate = Podcast.aggregate(pipeline);
        const options = {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
        };
        const list = await (Podcast as any).aggregatePaginate(aggregate, options);
        return list;
    }

    static async deletePodcast(_id: string): Promise<any> {
        const podcast = await Podcast.findByIdAndUpdate(_id, { is_deleted: true }, { new: true }).lean();
        if (!podcast) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'Podcast not found!',
            );
        }

        if (podcast.image) {
            await deleteImageFromCloudinary(podcast.image as string);
        }

        return podcast;
    }
}
