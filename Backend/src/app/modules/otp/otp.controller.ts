import { catchAsync } from '../../utils/catchAsync';
import { OTPService } from './otp.service';
// import { validEmailCheck } from '../auth/auth.utils';
import { generateOTP } from './otp.utils';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../errors/appError';
import { sendUserEmailGeneral } from '../../utils/sendEmail';
// import UserService from '../user/user.service';

export class OTPController {
    static sendOTP = catchAsync(async (req: any, res: any) => {
        // Coerce identifier and action from request body without strict validation
        const { identifier, action } = req.body.body;

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
        console.log('Generated OTP for', otpPayload.email, otp);
        await OTPService.postOTPByEmail({
            email: otpPayload.email,
            code: otp,
            action: otpPayload.action,
        });

        // Send OTP via email using nodemailer helper
        try {
            await sendUserEmailGeneral({
                email: otpPayload.email,
                subject: 'Newzify Email Verification OTP',
                message: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                        <h2>Verify Your Email for Newzify</h2>
                        <p>Thank you for registering. Please use the following One-Time Password (OTP) to complete your signup process. This code is valid for 2 minutes.</p>
                        <div style="font-size: 24px; font-weight: bold; padding: 10px 20px; background-color: #f3f4f6; display: inline-block; border-radius: 5px; color: #4f46e5; margin: 15px 0;">
                            ${otp}
                        </div>
                        <p>If you did not request this, please ignore this email.</p>
                    </div>
                `,
            });
            console.log(`OTP email sent successfully to ${otpPayload.email}`);
        } catch (mailError: any) {
            console.error('Failed to send OTP email:', mailError);
            throw new AppError(
                500,
                'Email Dispatch Failed',
                'Failed to send OTP to your email. Please try again later.',
            );
        }

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
