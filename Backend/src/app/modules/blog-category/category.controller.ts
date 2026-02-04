import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import BlogCategoryService from './category.service';

export class BlogCategoryController {
    static createCategory = catchAsync(async (req, res) => {
        const { body } = req.body;
        const created = await BlogCategoryService.createCategory(body);
        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'Blog category created successfully',
            data: created,
        });
    });

    static updateCategory = catchAsync(async (req, res) => {
        const { body } = req.body;
        const updated = await BlogCategoryService.updateCategory(body._id, body);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Blog category updated successfully',
            data: updated,
        });
    });

    static listCategories = catchAsync(async (req, res) => {
        const query = req.query || {};
        const list = await BlogCategoryService.listCategories({}, query);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Blog categories fetched successfully',
            data: list,
        });
    });

    static getCategory = catchAsync(async (req, res) => {
        const { id } = req.params;
        const category = await BlogCategoryService.findById(id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Blog category fetched successfully',
            data: category,
        });
    });

    static deleteCategory = catchAsync(async (req, res) => {
        const { body } = req.body;
        await BlogCategoryService.deleteCategory(body._id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Blog category deleted successfully',
            data: null,
        });
    });
}
