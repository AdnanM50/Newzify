import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import MessageService from "./message.service";

export class MessageController {
    static send = catchAsync(async (req, res) => {
        const user = res.locals.user;
        const { conversationId, content } = req.body;
        const message = await MessageService.sendMessage(
            conversationId,
            user._id,
            content
        );
        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "Message sent successfully",
            data: message,
        });
    });

    static list = catchAsync(async (req, res) => {
        const { conversationId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const data = await MessageService.getMessages(
            conversationId,
            page,
            limit
        );
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Messages fetched successfully",
            data,
        });
    });

    static markRead = catchAsync(async (req, res) => {
        const user = res.locals.user;
        const { conversationId } = req.params;
        await MessageService.markAsRead(conversationId, user._id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Messages marked as read",
            data: null,
        });
    });

    static unreadCount = catchAsync(async (_req, res) => {
        const user = res.locals.user;
        const count = await MessageService.getUnreadCount(user._id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Unread count fetched",
            data: { count },
        });
    });
}
