import { z } from 'zod';

const postSettingValidationSchema = z.object({
    body: z.object({
        site_name: z
            .string()
            .optional(),
        site_email: z
            .string()
            .email({
                message: 'Invalid email address',
            })
            .optional(),
        site_phone: z
            .string()
            .optional(),
        site_logo: z
            .string()
            .optional(),
        site_address: z
            .string()
            .optional(),
        site_description: z
            .string()
            .optional(),
        site_footer: z
            .string()
            .optional(),
        currency_code: z
            .string()
            .optional(),
        currency_symbol: z
            .string()
            .optional(),
        client_side_url: z
            .string()
            .url({
                message: 'URL must be string',
            })
            .optional(),
        server_side_url: z
            .string()
            .url({
                message: 'URL must be a string',
            })
            .optional(),
        otp_verification_type: z
            .enum(['email', 'phone'] as const)
            .optional(),
        file_upload_type: z
            .enum(['s3', 'local'] as const)
            .optional(),
        email_config: z
            .object(
                {
                    default: z
                        .enum(['gmail', 'sendgrid'] as const)
                        .optional(),
                    sendgrid: z
                        .object(
                            {
                                host: z
                                    .string()
                                    .optional(),
                                port: z
                                    .number()
                                    .optional(),
                                username: z
                                    .string()
                                    .optional(),
                                password: z
                                    .string()
                                    .optional(),
                                sender_email: z
                                    .string()
                                    .optional(),
                            },
                            {
                                message: 'sendgrid must be object',
                            },
                        )
                        .optional(),
                    gmail: z
                        .object(
                            {
                                auth_email: z
                                    .string()
                                    .optional(),
                                password: z
                                    .string()
                                    .optional(),
                                service_provider: z
                                    .string()
                                    .optional(),
                            },
                            {
                                message: 'sendgrid must be object',
                            },
                        )
                        .optional(),
                },
                {
                    message: 'email_config must be object',
                },
            )
            .optional(),
        phone_config: z
            .object(
                {
                    twilio_auth_token: z
                        .string()
                        .optional(),
                    twilio_sender_number: z
                        .string()
                        .optional(),
                    twilio_account_sid: z
                        .string()
                        .optional(),
                    is_active: z
                        .boolean()
                        .optional(),
                },
                {
                    message: 'sms must be object',
                },
            )
            .optional(),
        //payment method -->
        stripe: z
            .object({
                credentials: z.object({
                    stripe_publishable_key: z
                        .string()
                        .optional(),
                    stripe_secret_key: z
                        .string()
                        .optional(),
                    stripe_webhook_secret: z
                        .string()
                        .optional(),
                }),
                is_active: z
                    .boolean()
                    .optional(),
                logo: z
                    .string()
                    .optional(),
                name: z.string(),
            })
            .optional(),
        paypal: z
            .object({
                credentials: z.object({
                    paypal_base_url: z
                        .string()
                        .optional(),
                    paypal_client_id: z
                        .string()
                        .optional(),
                    paypal_secret_key: z
                        .string()
                        .optional(),
                }),
                is_active: z
                    .boolean()
                    .optional(),
                logo: z
                    .string()
                    .optional(),
                name: z.string(),
            })
            .optional(),
        razorpay: z
            .object({
                credentials: z.object({
                    razorpay_key_id: z
                        .string()
                        .optional(),
                    razorpay_key_secret: z
                        .string()
                        .optional(),
                }),
                is_active: z
                    .boolean()
                    .optional(),
                logo: z
                    .string()
                    .optional(),
                name: z.string(),
            })
            .optional(),
        social_media_link: z
            .array(
                z.object({
                    name: z.string(),
                    link: z.string(),
                }),
            )
            .optional(),
        partner: z
            .array(
                z.string(),
            )
            .optional(),
        otp_required:z.boolean().optional(),
    }),
});

export const SettingValidations = {
    postSettingValidationSchema,
};
