import { catchAsync } from '../../utils/catchAsync';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { BlogService } from './blog.service';
import mongoose from 'mongoose';
import AppError from "../../errors/appError";
export class BlogController {
    static createBlogs = catchAsync(async (req, res) => {
        const { body } = req.body;
        const { user } = res.locals;

        await BlogService.postBlogs({ ...body, author: user._id });
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Blog created successfully',
            data: undefined,
        });
    });
    static getBlogListByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {};
        const langCode = query.langCode || 'en';
        if (query.search) {
            filter[`title.${langCode}`] = {
                $regex: new RegExp(query.search, 'i'),
            };
        }
        if (query._id) {
            const data = await BlogService.findBlogById(query._id);
            if (!data) {
                throw new AppError(
                    HttpStatusCode.BadRequest,
                    'Request Failed !',
                    "Blog can't exists",
                );
            }
            sendResponse(res, {
                statusCode: HttpStatusCode.Created,
                success: true,
                message: 'Blog get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            updatedAt: 0,
        };
        const blog = await BlogService.findBlogListByQuery(
            filter,
            query,
            select,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Blog list get successfully',
            data: blog,
        });
    });
    static getBlogListByPublic = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {
            is_active: true,
        };
        const langCode = query.langCode || 'en';
        if (query.is_latest) {
            filter['is_latest'] = query.is_latest === 'true';
        }
        if (query.search) {
            filter[`title.${langCode}`] = {
                $regex: new RegExp(query.search, 'i'),
            };
        }
        if (query.category) {
            filter['category'] = new mongoose.Types.ObjectId(query.category);
        }
        if (query._id) {
            const data = await BlogService.findBlogById(query._id);
            if (!data) {
                throw new AppError(
                    HttpStatusCode.BadRequest,
                    'Request Failed !',
                    "Blog can't exists",
                );
            }
            sendResponse(res, {
                statusCode: HttpStatusCode.Created,
                success: true,
                message: 'Blog get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            updatedAt: 0,
            tags: 0,
            // banner_image: 0,
            description: 0,
        };
        const blog = await BlogService.findBlogListByQuery(
            filter,
            query,
            select,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Blog list get successfully',
            data: blog,
        });
    });
    static getBlogCategoryListByPublic = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {
            is_active: true,
        };
        const blog = await BlogService.findBlogCategoryListByQuery(
            filter,
            query,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Blog Category list get successfully',
            data: blog,
        });
    });
    static updateBlogByAdmin = catchAsync(async (req, res) => {
        const { body } = req.body;
        const exist = await BlogService.findBlogById(body._id);
        if (!exist) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Blog not found !',
            );
        }
        await BlogService.updateBlogByQuery({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Blog updated successfully',
            data: undefined,
        });
    });
    static deleteBlogByAdmin = catchAsync(async (req, res) => {
        const { id } = req.params;
        const exist = await BlogService.findBlogById(id);
        if (!exist) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Blog not found !',
            );
        }
        await BlogService.deleteBlogById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Blog deleted successfully',
            data: undefined,
        });
    });
}
