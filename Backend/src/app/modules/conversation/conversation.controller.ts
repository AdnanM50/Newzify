import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import ConversationService from "./conversation.service";

export class ConversationController {
    static list = catchAsync(async (_req, res) => {
        const user = res.locals.user;
        const conversations = await ConversationService.getUserConversations(
            user._id
        );
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Conversations fetched successfully",
            data: conversations,
        });
    });

    static getOrCreate = catchAsync(async (req, res) => {
        const user = res.locals.user;
        const { participantId } = req.body;
        const conversation = await ConversationService.getOrCreateConversation(
            user._id,
            participantId
        );
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Conversation fetched successfully",
            data: conversation,
        });
    });
}
