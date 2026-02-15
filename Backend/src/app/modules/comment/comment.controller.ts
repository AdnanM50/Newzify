import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CommentService } from "./comment.service";
import { HttpStatusCode } from "axios";

const createComment = catchAsync(async (req: Request, res: Response) => {
    const user = res.locals.user;
    const result = await CommentService.createComment(user._id, req.body);

    sendResponse(res, {
        statusCode: HttpStatusCode.Created,
        success: true,
        message: "Comment created successfully",
        data: result,
    });
});

const getCommentsByNewsId = catchAsync(async (req: Request, res: Response) => {
    const { newsId } = req.params;
    const result = await CommentService.getCommentsByNewsId(newsId);

    sendResponse(res, {
        statusCode: HttpStatusCode.Ok,
        success: true,
        message: "Comments fetched successfully",
        data: result,
    });
});

const toggleLike = catchAsync(async (req: Request, res: Response) => {
    const user = res.locals.user;
    const { id } = req.params;
    const result = await CommentService.toggleLike(user._id, id);

    sendResponse(res, {
        statusCode: HttpStatusCode.Ok,
        success: true,
        message: "Like toggled successfully",
        data: result,
    });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
    const user = res.locals.user;
    const { id } = req.params;
    const result = await CommentService.deleteComment(user._id, id);

    sendResponse(res, {
        statusCode: HttpStatusCode.Ok,
        success: true,
        message: "Comment deleted successfully",
        data: result,
    });
});

export const CommentController = {
    createComment,
    getCommentsByNewsId,
    toggleLike,
    deleteComment,
};
