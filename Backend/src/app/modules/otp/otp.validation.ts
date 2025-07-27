import { z } from 'zod';

const postOTPValidationSchema = z.object({
    body: z.object({
        identifier: z
            .string('Identifier must be a string')
            .refine(
                (value) => {
                    // Check if input matches email format or phone number format
                    return (
                        /^\+(?:[0-9] ?){6,14}[0-9]$/.test(value) ||
                        z.string().email().safeParse(value).success
                    );
                },
                {
                    message: 'Identifier must be a valid email or phone number',
                },
            ),
        action: z.enum(['forget_password', 'signup', 'profile_update'], {
            message: 'Action must be one of: forget_password, signup, profile_update',
        }),
    }),
});

const postOTPVerifyValidationSchema = z.object({
    body: z.object({
        identifier: z
            .string('Identifier must be a string')
            .refine(
                (value) => {
                    // Check if input matches email format or phone number format
                    return (
                        /^\+(?:[0-9] ?){6,14}[0-9]$/.test(value) ||
                        z.string().email().safeParse(value).success
                    );
                },
                {
                    message: 'Identifier must be a valid email or phone number',
                },
            ),
        otp: z.string('OTP must be string'),
        otp_option: z.enum(['sms', 'email'], {
            message: 'OTP option must be sms or email',
        }),
    }),
});

export const OTPValidations = {
    postOTPValidationSchema,
    postOTPVerifyValidationSchema,
};
