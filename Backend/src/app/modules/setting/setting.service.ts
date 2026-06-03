import AppError from '../../errors/appError';
import Setting from './setting.model';
import { Types } from 'mongoose';
import { deleteImageFromCloudinary } from '../../utils/cloudinary.helper';

export class SettingService {
    static async postSiteSettings(payload: any) {
        const oldSettings = await Setting.findOne({}).lean();
        await Setting.findOneAndUpdate({}, payload, { upsert: true });
        
        if (oldSettings) {
            if (oldSettings.site_logo && payload.site_logo && oldSettings.site_logo !== payload.site_logo) {
                await deleteImageFromCloudinary(oldSettings.site_logo as string);
            }
            if (oldSettings.stripe?.logo && payload.stripe?.logo && oldSettings.stripe.logo !== payload.stripe.logo) {
                await deleteImageFromCloudinary(oldSettings.stripe.logo as string);
            }
            if (oldSettings.paypal?.logo && payload.paypal?.logo && oldSettings.paypal.logo !== payload.paypal.logo) {
                await deleteImageFromCloudinary(oldSettings.paypal.logo as string);
            }
            if (oldSettings.razorpay?.logo && payload.razorpay?.logo && oldSettings.razorpay.logo !== payload.razorpay.logo) {
                await deleteImageFromCloudinary(oldSettings.razorpay.logo as string);
            }
        }
    }
    public static async getSiteSettings() {
        const settings: any[] = await Setting.aggregate([
            {
                $project: {
                    _id: 1,
                    site_name: 1,
                    site_email: 1,
                    site_phone: 1,
                    site_logo: 1,
                    otp_verification_type: 1,
                    site_address: 1,
                    site_description: 1,
                    site_footer: 1,
                    currency_code: 1,
                    currency_symbol: 1,
                    address: 1,
                    social_media_link: 1,
                    partner: 1,
                    otp_required:1
                },
            },
        ]);
        if (settings.length === 0) {
            throw new AppError(404, 'Request failed', 'Settings not found!');
        }
        return settings[0];
    }
    public static async getSettings(
        filter: Record<string, string | Types.ObjectId>,
        localFields: string,
    ): Promise<any> {
        const setting = await Setting.findOne(filter)
            .select(localFields)
            .lean();
        if (!setting) {
            throw new AppError(
                404,
                'Request failed',
                'Setting data not found!',
            );
        }
        return setting;
    }

    public static async getSettingsBySelect(selects: string) {
        const setting = await Setting.findOne({}).select(selects).lean();
        if (!setting) {
            throw new AppError(
                404,
                'Request failed',
                'Setting data not found!',
            );
        }
        return setting;
    }
}
