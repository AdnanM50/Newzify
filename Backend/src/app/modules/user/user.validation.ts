import {z} from 'zod';
import mongoose from 'mongoose';

const userRegisterValidate = z.object({
    body: z.object({
        first_name: z.string({
            required_error: 'First name is required',
            invalid_type_error: 'First name must be a string',
        }).min(1, {
            message: 'First name must be at least 1 character long',
        }).max(50, {
            message: 'First name must be at most 50 characters long',
        }),
        last_name: z.string({
            required_error: 'Last name is required',
            invalid_type_error: 'Last name must be a string',
        }).min(1, {
            message: 'Last name must be at least 1 character long',
        }).max(50, {
            message: 'Last name must be at most 50 characters long',
        }),
        email: z.string({
            required_error: 'Email is required',
            invalid_type_error: 'Email must be a string',
        }).email({
            message: 'Email must be a valid email address',
        }).max(100, {
            message: 'Email must be at most 100 characters long',
        }),
        phone: z.string({
            invalid_type_error: 'Phone must be string',
            required_error: 'Phone is required',
        }),
        password: z.string({
            required_error: 'Password is required',
            invalid_type_error: 'Password must be a string',
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
                invalid_type_error: 'User last name must be string',
                required_error: 'User last name is required',
            })
            .max(50, {
                message: 'Name must be less than or equal to 50 characters',
            })
            .optional(),
        last_name_name: z
            .string({
                invalid_type_error: 'User last name must be string',
                required_error: 'User last name is required',
            })
            .max(50, {
                message: 'Last name must be less than or equal to 50 characters',
            })
            .optional(),
        email: z
            .string({
                invalid_type_error: 'User email must be string',
                required_error: 'User email is required',
            })
            .email({ message: 'Invalid email address' })
            .optional(),
        phone: z
            .string({
                invalid_type_error: 'Phone must be string',
                required_error: 'Phone is required',
            })
            .optional(),
        image: z
            .string({
                invalid_type_error: 'image must be string',
            })
            .optional(),
        country: z
            .string({
                invalid_type_error: 'Country must be string',
                required_error: 'Country is required',
            })
            .max(250, {
                message: 'Country must be less than or equal to 250 characters',
            })
            .optional(),
        city: z
            .string({
                invalid_type_error: 'City must be string',
                required_error: 'City is required',
            })
            .optional(),
        state: z
            .string({
                invalid_type_error: 'User statue must be string',
                required_error: 'User statue must be string',
            })
            .max(50, {
                message: 'State must be less than or equal to 50 characters',
            })
            .optional(),

        zip_code: z
            .string({
                invalid_type_error: 'User zip code must be string',
                required_error: 'User zip code is required',
            })
            .optional(),
        address: z
            .string({
                invalid_type_error: 'User address must be string',
                required_error: 'User address is required',
            })
            .max(250, {
                message: 'Country must be less than or equal to 250 characters',
            })
            .optional(),
    }),
});


export const UserValidations = {
    userRegisterValidate,
    updateUserProfileValidationSchema
};
