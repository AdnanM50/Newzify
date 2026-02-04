import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import NewsService from './news.service';
import { HttpStatusCode } from 'axios';
import AppError from '../../errors/appError';
import Category from '../news-category/category.model';

export class NewsController {
    static createNews = catchAsync(async (req, res) => {
        const payload = req.body; // expecting { body: { ... } }
        const { body } = payload;
        const user = res.locals.user;
        // attach author
        body.author = user?._id;

        // If types provided, enforce reporter can only set one type
        if (body.types && Array.isArray(body.types)) {
            if (user?.role !== 'admin' && body.types.length > 1) {
                throw new AppError(
                    HttpStatusCode.Forbidden,
                    'Forbidden',
                    'Reporters can only assign one news type. Admins can assign multiple.',
                );
            }
        }

        // If category provided, ensure it exists and not deleted
        if (body.category) {
            const category = await Category.findById(body.category).lean();
            if (!category || category.is_deleted) {
                throw new AppError(
                    HttpStatusCode.NotFound,
                    'Not Found',
                    'Category not found!',
                );
            }
        }

        const created = await NewsService.createNews(body);
        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'News created successfully',
            data: created,
        });
    });

    static updateNews = catchAsync(async (req, res) => {
        const payload = req.body;
        const { body } = payload; // expects { _id, ...update }
        const user = res.locals.user;

        // If types provided, enforce reporter can only set one type
        if (body.types && Array.isArray(body.types)) {
            if (user?.role !== 'admin' && body.types.length > 1) {
                throw new AppError(
                    HttpStatusCode.Forbidden,
                    'Forbidden',
                    'Reporters can only assign one news type. Admins can assign multiple.',
                );
            }
        }

        // If category provided, ensure it exists and not deleted
        if (body.category) {
            const category = await Category.findById(body.category).lean();
            if (!category || category.is_deleted) {
                throw new AppError(
                    HttpStatusCode.NotFound,
                    'Not Found',
                    'Category not found!',
                );
            }
        }

        const updated = await NewsService.updateNews(body._id, body);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'News updated successfully',
            data: updated,
        });
    });
    static publicList = catchAsync(async (req, res) => {
        const query = req.query || {};
        const filter = { is_deleted: false, status: 'published' };
        const list = await NewsService.listNews(filter, query);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Public news list fetched successfully',
            data: list,
        });
    });

    static publicGet = catchAsync(async (req, res) => {
        const { id } = req.params;
        const news = await NewsService.findById(id);
        if (news.is_deleted || news.status !== 'published') {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'News not found!',
            );
        }
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'News fetched successfully',
            data: news,
        });
    });

    static listNews = catchAsync(async (req, res) => {
        const user = res.locals.user;
        const query = req.query || {};
        let filter: any = { is_deleted: false };
        if (user?.role === 'reporter') {
            filter.author = user._id;
        }
        const list = await NewsService.listNews(filter, query);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'News list fetched successfully',
            data: list,
        });
    });

    static getNews = catchAsync(async (req, res) => {
        const { id } = req.params;
        const user = res.locals.user;
        const news = await NewsService.findById(id);
        if (news.is_deleted) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'News not found!',
            );
        }
        if (user?.role === 'reporter' && String(news.author) !== String(user._id)) {
            throw new AppError(
                HttpStatusCode.Forbidden,
                'Forbidden',
                'You do not have permission to view this news.',
            );
        }
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'News fetched successfully',
            data: news,
        });
    });

    static deleteNews = catchAsync(async (req, res) => {
        const payload = req.body;
        const { body } = payload; // expects { _id }
        const user = res.locals.user;
        const news = await NewsService.findById(body._id);
        if (!news) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'News not found!',
            );
        }
        if (user?.role === 'reporter' && String(news.author) !== String(user._id)) {
            throw new AppError(
                HttpStatusCode.Forbidden,
                'Forbidden',
                'Reporters can only delete their own news.',
            );
        }
        await NewsService.deleteNews(body._id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'News deleted successfully',
            data: null,
        });
    });
}
