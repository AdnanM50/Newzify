import { z } from 'zod';

const userLoginValidationSchema = z.object({
    body: z.object({
        identifier: z
            .string()
            .refine(
                (value) => {
                    // Check if input matches email format or phone number format
                    return (
                        /^\+(?:[0-9] ?){6,14}[0-9]$/.test(value) ||
                        z.string().email().safeParse(value).success
                    );
                },
                {
                    message:
                        'User identifier must be a valid email or phone number',
                },
            ),
        password: z
            .string()
            .min(6, {
                message:
                    'Password must be greater than or equal to 6 characters',
            })
            .max(100, {
                message:
                    'Password must be less than or equal to 100 characters',
            })
            .trim(),
    }),
});
const identifierValidations = z.object({
    body: z.object({
        phone: z
            .string()
            .optional(),

        email: z
            .string()
            .email({
                message: 'Invalid email address',
            })
            .optional(),
    }),
});
const forgetPasswordOtpVerify = z.object({
    body: z.object({
        otp: z.string(),
        identifier: z
            .string()
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
        action: z.enum(['forget_password', 'signup', 'profile_update'] as const),
    }),
});
const forgetPasswordValidationSchema = z.object({
    body: z.object({
        password: z
            .string()
            .min(6, {
                message:
                    'Password must be greater than or equal to 6 characters',
            })
            .max(100, {
                message:
                    'Password must be less than or equal to 100 characters',
            }),
        confirm_password: z
            .string()
            .min(6, {
                message:
                    'Password must be greater than or equal to 6 characters',
            })
            .max(100, {
                message:
                    'Password must be less than or equal to 100 characters',
            }),
    }),
});
const passwordUpdateValidationSchema = z.object({
    body: z.object({
        old_password: z
            .string()
            .min(6, {
                message:
                    'Password must be greater than or equal to 6 characters',
            })
            .max(100, {
                message:
                    'Password must be less than or equal to 100 characters',
            }),
        password: z
            .string()
            .min(6, {
                message:
                    'Password must be greater than or equal to 6 characters',
            })
            .max(100, {
                message:
                    'Password must be less than or equal to 100 characters',
            }),
        confirm_password: z
            .string()
            .min(6, {
                message:
                    'Password must be greater than or equal to 6 characters',
            })
            .max(100, {
                message:
                    'Password must be less than or equal to 100 characters',
            }),
    }),
});
export const AuthValidations = {
    userLoginValidationSchema,
    forgetPasswordOtpVerify,
    forgetPasswordValidationSchema,
    identifierValidations,
    passwordUpdateValidationSchema,
};
