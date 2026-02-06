import nodemailer from 'nodemailer';
import Setting from '../modules/setting/setting.model';
import config from '../config';

export type TData = {
    email: string;
    subject: string;
    message: string;
};

export const sendUserEmailGeneral = async (data: TData) => {
    let transporter: any, from_email: string | undefined;

    // Hardcoded Ethereal SMTP credentials as requested
    const etherealConfig = {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'amina.hermiston@ethereal.email',
            pass: 'eSGUVSE1qkgwR73GFf',
        },
    };

    transporter = nodemailer.createTransport({
        host: etherealConfig.host,
        port: etherealConfig.port,
        secure: false, // true for 465, false for other ports
        auth: etherealConfig.auth,
    });
    
    // Using requested from email with a friendly display name
    from_email = '"Newzify" <md.adnanhossain88@gmail.com>';

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
