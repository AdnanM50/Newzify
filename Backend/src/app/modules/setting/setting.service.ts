import AppError from '../../errors/appError';
import Setting from './setting.model';
import { Types } from 'mongoose';

export class SettingService {
    static async postSiteSettings(payload: any) {
        await Setting.findOneAndUpdate({}, payload, { upsert: true });
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
