import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import EditorialService from './editorial.service';
import { HttpStatusCode } from 'axios';
import AppError from '../../errors/appError';
import { Types } from 'mongoose';

export class EditorialController {
    static createEditorial = catchAsync(async (req, res) => {
        const body = req.body;
        const user = res.locals.user;
        body.author = user?._id;

        const created = await EditorialService.createEditorial(body);
        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'Editorial created successfully',
            data: created,
        });
    });

    static updateEditorial = catchAsync(async (req, res) => {
        const body = req.body;
        const user = res.locals.user;

        const editorial = await EditorialService.findById(body._id);
        if (!editorial) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'Editorial not found!',
            );
        }

        // Ownership check for reporters
        if (user?.role === 'reporter' && String(editorial.author?._id || editorial.author) !== String(user._id)) {
            throw new AppError(
                HttpStatusCode.Forbidden,
                'Forbidden',
                'You do not have permission to update this editorial.',
            );
        }

        // Admin restriction: Cannot edit reporter editorials
        if (user?.role === 'admin' && editorial.author?.role === 'reporter') {
            throw new AppError(
                HttpStatusCode.Forbidden,
                'Forbidden',
                'Admins cannot edit editorials authored by reporters.',
            );
        }

        const updated = await EditorialService.updateEditorial(body._id, body);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Editorial updated successfully',
            data: updated,
        });
    });

    static publicList = catchAsync(async (req, res) => {
        const query = req.query || {};
        const filter: any = { is_deleted: false, status: 'published' };

        if (query.category) {
            filter.category = query.category;
        }

        if (query.is_editors_pick === 'true') {
            filter.is_editors_pick = true;
        }

        const list = await EditorialService.listEditorials(filter, query);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Public editorials list fetched successfully',
            data: list,
        });
    });

    static publicGet = catchAsync(async (req, res) => {
        const { id } = req.params;
        const editorial = await EditorialService.findById(id);
        if (editorial.is_deleted || editorial.status !== 'published') {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'Editorial not found!',
            );
        }
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Editorial fetched successfully',
            data: editorial,
        });
    });

    static listEditorials = catchAsync(async (req, res) => {
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
        const list = await EditorialService.listEditorials(filter, query);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Editorials list fetched successfully',
            data: list,
        });
    });

    static getEditorial = catchAsync(async (req, res) => {
        const { id } = req.params;
        const user = res.locals.user;
        const editorial = await EditorialService.findById(id);
        if (editorial.is_deleted) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'Editorial not found!',
            );
        }

        const authorId = editorial.author?._id || editorial.author;
        if (user?.role === 'reporter' && String(authorId) !== String(user._id)) {
            throw new AppError(
                HttpStatusCode.Forbidden,
                'Forbidden',
                'You do not have permission to view this editorial.',
            );
        }
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Editorial fetched successfully',
            data: editorial,
        });
    });

    static deleteEditorial = catchAsync(async (req, res) => {
        const { _id } = req.body;
        const user = res.locals.user;
        const editorial = await EditorialService.findById(_id);
        if (!editorial) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'Editorial not found!',
            );
        }

        const authorId = editorial.author?._id || editorial.author;
        if (user?.role === 'reporter' && String(authorId) !== String(user._id)) {
            throw new AppError(
                HttpStatusCode.Forbidden,
                'Forbidden',
                'Reporters can only delete their own editorials.',
            );
        }
        await EditorialService.deleteEditorial(_id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Editorial deleted successfully',
            data: null,
        });
    });
}
