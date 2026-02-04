import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import CategoryService from './category.service';
import AppError from '../../errors/appError';
import { HttpStatusCode } from 'axios';

export class CategoryController {
    static createCategory = catchAsync(async (req, res) => {
        const payload = req.body;
        const { body } = payload;
        const user = res.locals.user;
        if (!user || user.role !== 'admin') {
            throw new AppError(
                HttpStatusCode.Forbidden,
                'Forbidden',
                'Only admin can create categories.',
            );
        }
        const created = await CategoryService.createCategory(body);
        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'Category created successfully',
            data: created,
        });
    });

    static updateCategory = catchAsync(async (req, res) => {
        const payload = req.body;
        const { body } = payload; // expects { _id, ...update }
        const user = res.locals.user;
        if (!user || user.role !== 'admin') {
            throw new AppError(
                HttpStatusCode.Forbidden,
                'Forbidden',
                'Only admin can update categories.',
            );
        }
        const updated = await CategoryService.updateCategory(body._id, body);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Category updated successfully',
            data: updated,
        });
    });

    static deleteCategory = catchAsync(async (req, res) => {
        const payload = req.body;
        const { body } = payload; // expects { _id }
        const user = res.locals.user;
        if (!user || user.role !== 'admin') {
            throw new AppError(
                HttpStatusCode.Forbidden,
                'Forbidden',
                'Only admin can delete categories.',
            );
        }
        await CategoryService.deleteCategory(body._id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Category deleted successfully',
            data: null,
        });
    });

    static listCategories = catchAsync(async (req, res) => {
        const query = req.query || {};
        const list = await CategoryService.listCategories({}, query);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Category list fetched successfully',
            data: list,
        });
    });
}
