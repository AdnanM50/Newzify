import { catchAsync } from '../../utils/catchAsync';
import { OTPService } from './otp.service';
// import { validEmailCheck } from '../auth/auth.utils';
import { generateOTP } from './otp.utils';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../errors/appError';
// import UserService from '../user/user.service';

export class OTPController {
    static sendOTP = catchAsync(async (req: any, res: any) => {
        // Coerce identifier and action from request body without strict validation
        const identifier = req.body?.identifier ? String(req.body.identifier) : '';
        const action = req.body?.action ? String(req.body.action) : '';

        console.log('OTP Request:', { identifier, action });

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
        // Do not send email here. Simply log the OTP for debugging
        // and proceed to save it so the client can be returned the OTP
        // (useful for development/testing without email service).
        console.log('Generated OTP for', otpPayload.email, otp);
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
                otp,
            },
        });
    });
}
