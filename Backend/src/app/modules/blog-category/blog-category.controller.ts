import { catchAsync } from '../../utils/catchAsync';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { BlogCategoryService } from './blog-category.service';
import AppError from "../../errors/appError";

export class BlogCategoryController {
    static createBlogCategory = catchAsync(async (req, res) => {
        const { body } = req.body;
        const existTeg = await BlogCategoryService.findBlogCategoryByQuery(
            {
                name: body.name,
                is_deleted: false,
            },
            false,
        );
        if (existTeg) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Blog category name already exists',
            );
        }
        await BlogCategoryService.postBlogCategoryies(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Blog category created successfully',
            data: undefined,
        });
    });
    static getCategoryListByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {
            is_deleted: false,
        };
        const langCode = query.langCode || 'en';
        if (query.search) {
            filter[`name.${langCode}`] = {
                $regex: new RegExp(query.search, 'i'),
            };
        }
        if (query._id) {
            const data = await BlogCategoryService.findBlogCategoryById(
                query._id,
            );
            if (!data) {
                throw new AppError(
                    HttpStatusCode.BadRequest,
                    'Request Failed !',
                    "Blog category can't exists",
                );
            }
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Blog category fetch successfully',
                data,
            });
        }
        const catgeory = await BlogCategoryService.findBlogCategoryListByQuery(
            filter,
            query,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Category list get successfully',
            data: catgeory,
        });
    });
    static updateCategoryByAdmin = catchAsync(async (req, res) => {
        const { body } = req.body;
        const exist = await BlogCategoryService.findBlogCategoryById(body._id);
        if (!exist) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Blog category not found !',
            );
        }
        await BlogCategoryService.updateBlogCategoryByQuery(
            { _id: body._id },
            body,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Blog category updated successfully',
            data: undefined,
        });
    });
    static deleteCategoryByAdmin = catchAsync(async (req, res) => {
        const { id } = req.params;
        const exist = await BlogCategoryService.findBlogCategoryById(id);
        if (!exist) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Blog category not found !',
            );
        }
        await BlogCategoryService.deleteBlogCategoryById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Blog category deleted successfully',
            data: undefined,
        });
    });
}
