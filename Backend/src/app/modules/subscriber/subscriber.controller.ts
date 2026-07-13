import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { SubscriberService } from './subscriber.service';

export class SubscriberController {
    static subscribe = catchAsync(async (req, res) => {
        const { email } = req.body;
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
        const { email } = req.body;
        await SubscriberService.unsubscribe(email);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Successfully unsubscribed',
            data: null,
        });
    });

    static deleteSubscriber = catchAsync(async (req, res) => {
        const { _id } = req.body;
        await SubscriberService.deleteSubscriber(_id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Subscriber deleted successfully',
            data: null,
        });
    });
}
