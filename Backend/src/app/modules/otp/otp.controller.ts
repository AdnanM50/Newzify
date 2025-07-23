import { catchAsync } from '../../utils/catchAsync';

import { OTPService } from './otp.service';
import { validEmailCheck } from '../auth/auth.utils';
import { generateOTP } from './otp.utils';
import config from '../../config';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../errors/appError';
import UserService from '../user/user.service';
// import { SettingService } from '../setting/setting.service';
import { sendUserEmailGeneral } from '../../utils/sendEmail';

export class OTPController {
    static sendOTP = catchAsync(async (req: any, res: any) => {
        const { body } = req.body;
        const { identifier, action } = body;

        const validationResult = validEmailCheck(identifier);
        let user = null;

        if (action !== 'signup') {
            user = await UserService.findUserByEmail(identifier, true);
            if (!user) {
                throw new AppError(
                    404,
                    'Request Failed',
                    'No account found with this email. Please try again or create a new account',
                );
            }
        } else {
            user = await UserService.findUserByEmail(identifier, true);
            if (user) {
                throw new AppError(
                    404,
                    'Request Failed',
                    'Account found with this email. Please try again',
                );
            }
        }

        const otpPayload = {
            email: identifier?.toLowerCase().trim(),
            action: action,
        };
        const isAlreadySend = await OTPService.findOneByQuery(otpPayload, false);
        if (isAlreadySend) {
            throw new AppError(
                400,
                'Request Failed',
                'Invalid or Expired OTP!',
            );
        }

        const otp = generateOTP(6);
        const data = {
            email: identifier?.toLowerCase().trim() as string,
            subject: `OTP verification code`,
            message: `<h3>Your verification OTP code is: </h3>
                       <div style="background-color: azure; margin: 01px 0px; padding: 5px">
                           <h3 style="margin-left: 5px; letter-spacing: 3px;">
                            ${otp}
                            </h3>
                       </div>
                       <h3>For any kind of help, please contact our support team.</h3>
                    `,
        };
        await sendUserEmailGeneral(data);
        await OTPService.postOTPByEmail({
            email: otpPayload.email,
            code: otp,
            action: otpPayload.action,
        });

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: `The verification OTP was sent to your email address.`,
            data: {
                type: 'email',
                identifier: identifier.trim(),
            },
        });
    });
}
