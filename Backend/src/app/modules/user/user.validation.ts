import {z} from 'zod';
import mongoose from 'mongoose';

const userRegisterValidate = z.object({
    body: z.object({
        first_name: z.string({
            message: 'First name must be a string',
        }).min(1, {
            message: 'First name is required',
        }).max(50, {
            message: 'First name must be at most 50 characters long',
        }),
        last_name: z.string({
            message: 'Last name must be a string',
        }).min(1, {
            message: 'Last name must be at least 1 character long',
        }).max(50, {
            message: 'Last name must be at most 50 characters long',
        }),
        email: z.string({
            message: 'Email must be a string',
        }).email({
            message: 'Email must be a valid email address',
        }).max(100, {
            message: 'Email must be at most 100 characters long',
        }),
        phone: z.string({
            message: 'Phone must be string',
        }),
        password: z.string({
            message: 'Password must be a string',
        }).min(6, {
            message: 'Password must be at least 6 characters long', 
        }).max(100, {
            message: 'Password must be at most 100 characters long',
        })
    })
})
const updateUserProfileValidationSchema = z.object({
    body: z.object({
        first_name: z
            .string({
                message: 'User first name must be string',
            })
            .max(50, {
                message: 'Name must be less than or equal to 50 characters',
            })
            .optional(),
        last_name: z
            .string({
                message: 'User last name must be string',
            })
            .max(50, {
                message: 'Last name must be less than or equal to 50 characters',
            })
            .optional(),
        email: z
            .string({
                message: 'User email must be string',
            })
            .email({ message: 'Invalid email address' })
            .optional(),
        phone: z
            .string({
                message: 'Phone must be string',
            })
            .optional(),
        image: z
            .string({
                message: 'image must be string',
            })
            .optional(),
        address: z
            .string({
                message: 'User address must be string',
            })
            .max(250, {
                message: 'Address must be less than or equal to 250 characters',
            })
            .optional(),
        work_experience: z
            .string({
                message: 'Work experience must be string',
            })
            .optional(),
    }),
});

const createReporterValidationSchema = z.object({
    body: z.object({
        first_name: z.string({
            message: 'First name is required',
        }),
        last_name: z.string({
            message: 'Last name is required',
        }),
        email: z.string({
            message: 'Valid email is required',
        }).email(),
        phone: z.string({
            message: 'Phone is required',
        }),
        password: z.string().min(6),
        work_experience: z.string().optional(),
    }),
});

const resetPasswordValidationSchema = z.object({
    body: z.object({
        userId: z.string(),
        newPassword: z.string().min(6),
    }),
});

export const UserValidations = {
    userRegisterValidate,
    updateUserProfileValidationSchema,
    createReporterValidationSchema,
    resetPasswordValidationSchema,
};
