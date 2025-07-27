import { HttpStatusCode } from "axios";
import AppError from "../../errors/appError";
import { catchAsync } from "../../utils/catchAsync"
import UserService from "../user/user.service";
import { comparePassword, createToken, validEmailCheck } from "./auth.utils";
import { TTokenPayload } from "./auth.interface";
import sendResponse from "../../utils/sendResponse";
import config  from "../../config";
import dayjs from "dayjs";
import { OTPService } from "../otp/otp.service";
import { AuthService } from "./auth.service";

export class AuthController {
    static loginAccess = catchAsync(async (req, res) => {
        const {body} = req.body;
        const { identifier, password } = body;
        const verificationResult = validEmailCheck(identifier);
        let user = null;
        if (verificationResult.success) {
            user = await UserService.findUserByEmail(identifier, true);
        }
        if (!user) {
            user = await UserService.findUserByPhone(identifier, true);
        }
        if(user.is_deleted) {
            throw new AppError(
               404,
                'Unauthorized',
                'User not found.',
            )
        }
        const isPasswordMatched = await comparePassword(
            password,
            user.password,
        );
        if (!isPasswordMatched) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Bad Request',
                'Invalid login credentials!',
            );
        }
        const tokenPayload:TTokenPayload = {
            _id: user._id,
            first_name: user.first_name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        }
        const accessToken = createToken(
            tokenPayload,
            config.jwt_access_secret as string,
            config.jwt_access_expires_in as string,
        );
        const refreshToken = createToken(
            tokenPayload,
            config.jwt_refresh_secret as string,
            config.jwt_refresh_expires_in as string,
        );
        res.cookie('refreshToken', refreshToken, {
            secure: config.node_env === 'prod',
            httpOnly: true,
        });
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'User logged in successfully',
            data: {
                user: {
                    _id: user?._id,
                    name: user?.name,
                    email: user?.email,
                    phone: user?.phone,
                    role: user?.role,
                },
                accessToken,
                refreshToken,
            },
        });
    })
    static forgetPasswordOTPVerify = catchAsync(async (req, res) => {
        const { body } = req.body;
        const { identifier, action, otp } = body;
        let otp_Object,
            user: any = null;
        const validationResult = validEmailCheck(identifier?.trim());
        
        // Determine verification type based on identifier format
        const isEmail = validationResult.success;
        
        if (isEmail) {
            otp_Object = await OTPService.findOTPByEmail({
                email: identifier,
                code: otp,
                action,
                permission: false,
            });
            user = await UserService.findUserByEmail(identifier, true);
        } else {
            otp_Object = await OTPService.findOtpByPhone({
                phone: identifier,
                code: otp,
                action,
                permission: false,
            });
            user = await UserService.findUserByPhone(identifier, true);
        }
        if (!otp_Object) {
            throw new AppError(
                400,
                'Failed to verify OTP',
                'Invalid or expired the OTP!',
            );
        }
        // check 1 min expiration time
        const startTime = dayjs(otp_Object.createdAt);
        const endTime = dayjs(Date.now());
        const expireTimesInMinute = endTime.diff(startTime, 'minute');
        if (expireTimesInMinute >= 2) {
            throw new AppError(
                400,
                'Invalid request',
                'OTP expired! Please try again.',
            );
        }
        if (
            otp_Object &&
            otp_Object?.attempts > 0 &&
            otp === otp_Object?.code
        ) {
            const tokenPayload: any = {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            };
            const accessToken = createToken(
                tokenPayload,
                config.jwt_access_secret as string,
                config.jwt_access_expires_in as string,
            );
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: `OTP verified Successfully`,
                data: {
                    phone: validationResult.success ? undefined : identifier,
                    email: validationResult.success ? identifier : undefined,
                    accessToken,
                },
            });
            return;
        }
        if (otp_Object) {
            otp_Object.attempts -= 1;
            await otp_Object.save();
        }
        throw new AppError(
            HttpStatusCode.BadRequest,
            'Request Failed',
            'Invalid OTP! Please try again.',
        );
    });
    static forgetPasswordSubmitTokenBased = catchAsync(async (req, res) => {
        const { body } = req.body;
        const { _id } = res.locals.user;
        await AuthService.forgetPasswordTokenBased(body, _id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Password updated Successfully',
            data: null,
        });
    });
    static userPasswordUpdate = catchAsync(async (req, res) => {
        const { body } = req.body;
        const { _id, password } = res.locals.user;
        
        const isPasswordMatched = await comparePassword(
            body.old_password,
            password,
        );
        if (!isPasswordMatched) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed',
                'Password not matched! Please try again.',
            );
        }
        await AuthService.forgetPasswordTokenBased(body, _id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Password updated Successfully',
            data: undefined,
        });
    });
}