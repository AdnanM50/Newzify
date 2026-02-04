import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import TagService from './tag.service';

export class TagController {
    static createTag = catchAsync(async (req, res) => {
        const { body } = req.body;
        const created = await TagService.createTag(body);
        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'Tag created successfully',
            data: created,
        });
    });

    static updateTag = catchAsync(async (req, res) => {
        const { body } = req.body;
        const updated = await TagService.updateTag(body._id, body);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Tag updated successfully',
            data: updated,
        });
    });

    static listTags = catchAsync(async (req, res) => {
        const query = req.query || {};
        const list = await TagService.listTags({}, query);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Tags fetched successfully',
            data: list,
        });
    });

    static getTag = catchAsync(async (req, res) => {
        const { id } = req.params;
        const tag = await TagService.findById(id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Tag fetched successfully',
            data: tag,
        });
    });

    static deleteTag = catchAsync(async (req, res) => {
        const { body } = req.body;
        await TagService.deleteTag(body._id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Tag deleted successfully',
            data: null,
        });
    });
}
