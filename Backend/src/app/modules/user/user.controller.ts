import { HttpStatusCode } from "axios";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import UserService from "./user.service";
import AppError from "../../errors/appError";
import {OTPService} from "../otp/otp.service";
import dayjs from "dayjs";
import {createToken} from "../auth/auth.utils";
import config from "../../config";
import httpStatus from "http-status";
import bcrypt from "bcrypt";

export class UserController {
   
  static getUserProfile = catchAsync(async (req, res) => {
        const { user } = res.locals;
        sendResponse(res,
            {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'User profile retrieved successfully',
                data: {
                    ...user,
                    password: undefined,
                    __v: undefined,
                    is_deleted: undefined,
                    fcm_token: undefined,
                },
            }
        )
    });
    static userProfileUpdate = catchAsync(async (req, res) => {
        const {_id} = res.locals.user;
        const {body} = req.body;
        const updateQuery = {_id}
        const updateDocument = {
            ...body,
            _id: undefined,
            role: undefined,
            password: undefined,
        }
        const user = await UserService.updateUserProfile(
            updateQuery,
            updateDocument,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Profile updated successfully',
            data: {
                ...user,
                password: undefined,
                __v: undefined,
                is_deleted: undefined,
                fcm_token: undefined,
            },
        });
    });

    static getUserList = catchAsync(async (req, res) => {
        const { role } = req.query;
        const filter: any = { is_deleted: false };
        if (role) {
            filter.role = role;
        }
        
        const result = await UserService.findUserListByQuery(filter, req.query);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'User list retrieved successfully',
            data: result,
        });
    });

    static createNewReporter = catchAsync(async (req, res) => {
        const payload = req.body.body;
        payload.role = 'reporter';
        
        // Check if user already exists
        const existingUser = await UserService.checkUserExists(payload.email, payload.phone);
        if (existingUser) {
            throw new AppError(HttpStatusCode.Conflict, 'Conflict', 'Email or Phone already exists');
        }

        const result = await UserService.createNewUser(payload);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Reporter created successfully',
            data: result,
        });
    });

    static deleteUser = catchAsync(async (req, res) => {
        const { id } = req.params;
        await UserService.deleteUserById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'User deleted successfully',
            data: null,
        });
    });

    static resetUserPassword = catchAsync(async (req, res) => {
        const { userId, newPassword } = req.body.body;
        const salt = Number(config.bcrypt_salt_rounds);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        await UserService.updateUserProfile({ _id: userId }, { password: hashedPassword });
        
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Password reset successfully',
            data: null,
        });
    });

    // User Profile Features
    static getLikedPosts = catchAsync(async (req, res) => {
        const { _id } = res.locals.user;
        const result = await UserService.findLikedPostsByUserId(_id, req.query);
        
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Liked posts retrieved successfully',
            data: result,
        });
    });

    static getUserComments = catchAsync(async (req, res) => {
        const { _id } = res.locals.user;
        const result = await UserService.findCommentsByUserId(_id, req.query);
        
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'User comments retrieved successfully',
            data: result,
        });
    });

    static getUserReplies = catchAsync(async (req, res) => {
        const { _id } = res.locals.user;
        const result = await UserService.findRepliesToUserComments(_id, req.query);
        
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Replies retrieved successfully',
            data: result,
        });
    });

    static toggleNewsLike = catchAsync(async (req, res) => {
        const { _id } = res.locals.user;
        const { newsId } = req.params;
        const result = await UserService.toggleNewsLike(newsId, _id);
        
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: result.isLiked ? 'News liked successfully' : 'News unliked successfully',
            data: result,
        });
    });
}