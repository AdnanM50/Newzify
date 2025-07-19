import { Types } from 'mongoose';

export type TOtp = {
    email: string;
    phone: string;
    code: string;
    action: string;
    attempts: number;
    otp_option: string;
    created_time: Date;
    expired_time: Date;
    expireAt: Date;
};
