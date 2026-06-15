import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import PodcastService from './podcast.service';
import { HttpStatusCode } from 'axios';
import AppError from '../../errors/appError';
import { Types } from 'mongoose';

export class PodcastController {
    static createPodcast = catchAsync(async (req, res) => {
        const body = req.body;
        const user = res.locals.user;
        body.author = user?._id;

        const created = await PodcastService.createPodcast(body);
        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'Podcast created successfully',
            data: created,
        });
    });

    static updatePodcast = catchAsync(async (req, res) => {
        const body = req.body;
        const user = res.locals.user;

        const podcast = await PodcastService.findById(body._id);
        if (!podcast) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'Podcast not found!',
            );
        }

        // Ownership check for reporters
        if (user?.role === 'reporter' && String(podcast.author?._id || podcast.author) !== String(user._id)) {
            throw new AppError(
                HttpStatusCode.Forbidden,
                'Forbidden',
                'You do not have permission to update this podcast.',
            );
        }

        // Admin restriction: Cannot edit reporter podcasts
        if (user?.role === 'admin' && podcast.author?.role === 'reporter') {
            throw new AppError(
                HttpStatusCode.Forbidden,
                'Forbidden',
                'Admins cannot edit podcasts authored by reporters.',
            );
        }

        const updated = await PodcastService.updatePodcast(body._id, body);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Podcast updated successfully',
            data: updated,
        });
    });

    static publicList = catchAsync(async (req, res) => {
        const query = req.query || {};
        const filter: any = { is_deleted: false, status: 'published' };

        if (query.category) {
            filter.category = query.category;
        }

        if (query.is_featured === 'true') {
            filter.is_featured = true;
        }

        const list = await PodcastService.listPodcasts(filter, query);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Public podcasts list fetched successfully',
            data: list,
        });
    });

    static publicGet = catchAsync(async (req, res) => {
        const { id } = req.params;
        const podcast = await PodcastService.findById(id);
        if (podcast.is_deleted || podcast.status !== 'published') {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'Podcast not found!',
            );
        }
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Podcast fetched successfully',
            data: podcast,
        });
    });

    static listPodcasts = catchAsync(async (req, res) => {
        const user = res.locals.user;
        const query = req.query || {};
        let filter: any = { is_deleted: false };
        if (user?.role === 'reporter') {
            filter.author = new Types.ObjectId(user._id);
        } else if (user?.role === 'admin') {
            if (query.author) {
                filter.author = new Types.ObjectId(query.author as string);
            }
        }
        const list = await PodcastService.listPodcasts(filter, query);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Podcasts list fetched successfully',
            data: list,
        });
    });

    static getPodcast = catchAsync(async (req, res) => {
        const { id } = req.params;
        const user = res.locals.user;
        const podcast = await PodcastService.findById(id);
        if (podcast.is_deleted) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'Podcast not found!',
            );
        }

        const authorId = podcast.author?._id || podcast.author;
        if (user?.role === 'reporter' && String(authorId) !== String(user._id)) {
            throw new AppError(
                HttpStatusCode.Forbidden,
                'Forbidden',
                'You do not have permission to view this podcast.',
            );
        }
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Podcast fetched successfully',
            data: podcast,
        });
    });

    static deletePodcast = catchAsync(async (req, res) => {
        const { _id } = req.body;
        const user = res.locals.user;
        const podcast = await PodcastService.findById(_id);
        if (!podcast) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'Podcast not found!',
            );
        }

        const authorId = podcast.author?._id || podcast.author;
        if (user?.role === 'reporter' && String(authorId) !== String(user._id)) {
            throw new AppError(
                HttpStatusCode.Forbidden,
                'Forbidden',
                'Reporters can only delete their own podcasts.',
            );
        }
        await PodcastService.deletePodcast(_id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Podcast deleted successfully',
            data: null,
        });
    });
}
