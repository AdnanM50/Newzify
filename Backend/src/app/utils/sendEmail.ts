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

    if (setting?.email_config?.default === 'sendgrid') {
        transporter = nodemailer.createTransport({
            // @ts-ignore
            host: setting?.email_config?.sendgrid?.host,
            port: setting?.email_config?.sendgrid?.port,
            secure: false,
            auth: {
                user: setting.email_config?.sendgrid?.sender_email,
                pass: setting?.email_config?.sendgrid?.password,
            },
        });
        from_email = setting?.email_config?.sendgrid?.sender_email;
    } else if (setting?.email_config?.default === 'gmail') {
        transporter = nodemailer.createTransport({
            secure: false,
            service: setting?.email_config?.gmail?.service_provider || 'gmail',
            auth: {
                user: setting?.email_config?.gmail?.auth_email,
                pass: setting?.email_config?.gmail?.password,
            },
        });
        from_email = setting?.email_config?.gmail?.auth_email;
    } else if (config.email_user && config.email_pass) {
        // Fallback to environment variables
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.email_user,
                pass: config.email_pass,
            },
        });
        from_email = config.email_user;
    }

    // Check if transporter is configured
    if (!transporter) {
        console.log('Email configuration not found. Skipping email send.');
        console.log('Email would have been sent to:', data.email);
        console.log('Subject:', data.subject);
        console.log('Message:', data.message);
        return { success: true, message: 'Email configuration not set up' };
    }

    return await transporter.sendMail({
        from: from_email, // sender address
        to: data.email, // list of receivers
        subject: data.subject, // Subject line
        html: data.message, // html body
    });
};
