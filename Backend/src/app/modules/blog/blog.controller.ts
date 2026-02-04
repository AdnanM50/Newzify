import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import BlogService from './blog.service';

export class BlogController {
    static createBlog = catchAsync(async (req, res) => {
        const { body } = req.body;
        const created = await BlogService.createBlog(body);
        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'Blog created successfully',
            data: created,
        });
    });

    static updateBlog = catchAsync(async (req, res) => {
        const { body } = req.body;
        const updated = await BlogService.updateBlog(body._id, body);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Blog updated successfully',
            data: updated,
        });
    });

    static listBlogs = catchAsync(async (req, res) => {
        const query = req.query || {};
        const list = await BlogService.listBlogs({}, query);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Blogs fetched successfully',
            data: list,
        });
    });

    static getBlog = catchAsync(async (req, res) => {
        const { id } = req.params;
        const blog = await BlogService.findById(id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Blog fetched successfully',
            data: blog,
        });
    });

    static deleteBlog = catchAsync(async (req, res) => {
        const { body } = req.body;
        await BlogService.deleteBlog(body._id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Blog deleted successfully',
            data: null,
        });
    });
}
