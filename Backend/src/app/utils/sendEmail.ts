import nodemailer from 'nodemailer';
import Setting from '../modules/setting/setting.model';
import config from '../config';

export type TData = {
    email: string;
    subject: string;
    message: string;
};

export const sendUserEmailGeneral = async (data: TData) => {
    const setting = await Setting.findOne({}).select('email_config').lean();
    let transporter: any, from_email;

    const emailConfig = setting?.email_config;

    if (
        emailConfig?.default === 'sendgrid' &&
        emailConfig?.sendgrid?.sender_email &&
        emailConfig?.sendgrid?.password
    ) {
        transporter = nodemailer.createTransport({
            // @ts-ignore
            host: emailConfig.sendgrid.host,
            port: emailConfig.sendgrid.port,
            secure: false,
            auth: {
                user: emailConfig.sendgrid.sender_email,
                pass: emailConfig.sendgrid.password,
            },
        });
        from_email = emailConfig.sendgrid.sender_email;
    } else if (
        emailConfig?.default === 'gmail' &&
        emailConfig?.gmail?.auth_email &&
        emailConfig?.gmail?.password
    ) {
        transporter = nodemailer.createTransport({
            secure: false,
            service: emailConfig.gmail.service_provider || 'gmail',
            auth: {
                user: emailConfig.gmail.auth_email,
                pass: emailConfig.gmail.password,
            },
        });
        from_email = emailConfig.gmail.auth_email;
    } else if (config.email_user && config.email_pass && (config as any).email_host && (config as any).email_port) {
        // Fallback to environment variables
        transporter = nodemailer.createTransport({
            host: (config as any).email_host,
            port: Number((config as any).email_port),
            secure: false, // true for 465, false for other ports
            auth: {
                user: config.email_user,
                pass: config.email_pass,
            },
        });
        from_email = config.email_user;
    }

    // Check if transporter is configured
    if (!transporter) {
        console.error('CRITICAL: Email configuration not found. Both database and environment variables are missing credentials.');
        console.log('Target Email:', data.email);
        return { success: false, message: 'Email configuration not set up' };
    }

    try {
        const info = await transporter.sendMail({
            from: from_email, // sender address
            to: data.email, // list of receivers
            subject: data.subject, // Subject line
            html: data.message, // html body
        });
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Nodemailer Error:', error);
        throw error;
    }
};
