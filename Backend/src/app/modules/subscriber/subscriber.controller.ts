import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { SubscriberService } from './subscriber.service';
import AppError from '../../errors/appError';

export class SubscriberController {
    static subscribe = catchAsync(async (req, res) => {
        const body = req.body.body || req.body;
        const { email } = body;
        if (!email) {
            throw new AppError(400, 'Bad Request', 'Email is required');
        }
        const subscriber = await SubscriberService.subscribe(email);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Successfully subscribed! A welcome email has been sent to your inbox.',
            data: subscriber,
        });
    });

    static listSubscribers = catchAsync(async (req, res) => {
        const query = req.query || {};
        const list = await SubscriberService.listSubscribers(query);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Subscribers fetched successfully',
            data: list,
        });
    });

    static unsubscribe = catchAsync(async (req, res) => {
        const body = req.body.body || req.body;
        const { email } = body;
        await SubscriberService.unsubscribe(email);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Successfully unsubscribed',
            data: null,
        });
    });

    static deleteSubscriber = catchAsync(async (req, res) => {
        const body = req.body.body || req.body;
        const { _id } = body;
        await SubscriberService.deleteSubscriber(_id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Subscriber deleted successfully',
            data: null,
        });
    });
}
