import { HttpStatusCode } from "axios";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import UserService from "./user.service";
import AppError from "../../errors/appError";
import {SettingService} from "../setting/setting.service";
import {OTPService} from "../otp/otp.service";
import dayjs from "dayjs";
import {createToken} from "../auth/auth.utils";
import config from "../../config";

export class UserController {
    static registerNewAccount = catchAsync(async (req, res) => {
        const payload = req.body;
        const findUser = await UserService.checkUserExists(payload.body.email, payload.body.phone);
        const settings = await SettingService.getSettings({}, '-updatedAt -__v')
        if (findUser) {
            throw new AppError(
                HttpStatusCode.Conflict,
                'User Already Exists',
                'User with this email or phone number already exists!',
            )
        }
        if(settings.otp_required===false){
            const newUser = await UserService.createNewUser(payload.body);
            if(!newUser){
                throw new AppError(
                    HttpStatusCode.BadRequest,
                    'Request Failed',
                    'Failed to create account! Please try again.',
                )
            }
            sendResponse(res,
                {
                    statusCode: HttpStatusCode.Created,
                    success: true,
                    message: 'Registration successfully',
                    data: null,
                }
            )
        }
        let otp;
        let user = null;
        if (settings.otp_verification_type === 'email') {
            otp = await OTPService.findOTPByEmail({
                email: payload.body.email,
                code: payload.body.otp,
                action: 'signup',
                permission: false,
            });
            user = await UserService.findUserByEmail(payload.body.email, true);
        }
        else {
            otp = await OTPService.findOtpByPhone({
                phone: payload.body.phone,
                code: payload.body.otp,
                action: 'signup',
                permission: false,
            });
            user = await UserService.findUserByPhone(payload.body.phone, false);
        }
        if (!otp) {
            throw new AppError(
                400,
                'Failed to verify OTP',
                'Invalid or expired the OTP!',
            );
        }
        // check 1 min expiration time
        const startTime = dayjs(otp.createdAt);
        const endTime = dayjs(Date.now());
        const expireTimesInMinute = endTime.diff(startTime, 'minute');
        if (expireTimesInMinute >= 2) {
            throw new AppError(
                400,
                'Invalid request',
                'OTP expired! Please try again.',
            );
        }

        if (otp && otp?.attempts > 0 && payload.body.otp === otp?.code) {
            if (user) {
                throw new AppError(
                    409,
                    'Failed to create account',
                    'User already exists with this email or phone number!',
                );
            }
            const newUser = await UserService.createNewUser(payload.body);
            const tokenPayload: any = {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role,
            };
            const accessToken = createToken(
                tokenPayload,
                config.jwt_access_secret as string,
                config.jwt_access_expires_in as string,
            );
            sendResponse(res, {
                statusCode: HttpStatusCode.Created,
                success: true,
                message: 'Registration successful',
                data: { accessToken },
            });
            return;
        }
        if (otp) {
            otp.attempts -= 1;
            await otp.save();
        }
        throw new AppError(
            HttpStatusCode.BadRequest,
            'Request Failed',
            'Invalid OTP! Please try again.',
        );
    });

 
}