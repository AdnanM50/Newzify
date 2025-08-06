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
}