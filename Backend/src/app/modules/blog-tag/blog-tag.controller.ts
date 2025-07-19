import { catchAsync } from '../../utils/catchAsync';
import { BlogTagService } from './blog-tag.service';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import AppError from "../../errors/appError";

export class BlogTagController {
    static createTags = catchAsync(async (req, res) => {
        const { body } = req.body;
        const existTeg = await BlogTagService.findBlogTagByQuery(
            {
                name: body.name,
                is_delete: false,
            },
            false,
        );
        if (existTeg) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Tag name already exists',
            );
        }
        await BlogTagService.postBlogTags(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Blog tag created successfully',
            data: undefined,
        });
    });
    static getTagListByAdmin = catchAsync(async (req, res) => {
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
            const tag = await BlogTagService.findBlogTagById(query._id);
            if (!tag) {
                throw new AppError(
                    HttpStatusCode.BadRequest,
                    'Request Failed !',
                    "Blog tag can't exists",
                );
            }
            sendResponse(res, {
                statusCode: HttpStatusCode.Created,
                success: true,
                message: 'Blog tag get successfully',
                data: tag,
            });
        }
        const tags = await BlogTagService.findBlogTagListByQuery(
            filter,
            query,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Blog tag list get successfully',
            data: tags,
        });
    });
    static updateTagsByAdmin = catchAsync(async (req, res) => {
        const { body } = req.body;
        const existTeg = await BlogTagService.findBlogTagById(body._id);
        if (!existTeg) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Blog tag not found !',
            );
        }
        await BlogTagService.updateBlogTagByQuery({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Blog tag updated successfully',
            data: undefined,
        });
    });
    static deleteTagsByAdmin = catchAsync(async (req, res) => {
        const { id } = req.params;
        const existTeg = await BlogTagService.findBlogTagById(id);
        if (!existTeg) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Blog tag not found !',
            );
        }
        await BlogTagService.deleteBlogTagById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Blog tag deleted successfully',
            data: undefined,
        });
    });
}
