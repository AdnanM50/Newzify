import { HttpStatusCode } from 'axios';
import AppError from '../../errors/appError';
import Subscriber from './subscriber.model';
import { sendUserEmailGeneral } from '../../utils/sendEmail';

export class SubscriberService {
    static async subscribe(email: string): Promise<any> {
        const existing = await Subscriber.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
            if (existing.is_active) {
                throw new AppError(
                    HttpStatusCode.BadRequest,
                    'Request Failed',
                    'This email is already subscribed!',
                );
            }
            existing.is_active = true;
            await existing.save();
            await SubscriberService.sendWelcomeEmail(email);
            return existing;
        }

        const subscriber = await Subscriber.create({
            email: email.toLowerCase().trim(),
        });

        await SubscriberService.sendWelcomeEmail(email);
        return subscriber;
    }

    static async listSubscribers(query: any = {}): Promise<any> {
        const filter: any = { is_active: true };
        if (query.search) {
            filter.email = { $regex: query.search, $options: 'i' };
        }
        const aggregate = Subscriber.aggregate([
            { $match: filter },
            { $project: { email: 1, is_active: 1, createdAt: 1 } },
        ]);
        const options = {
            page: query.page || 1,
            limit: query.limit || 20,
            sort: { createdAt: -1 },
        };
        const list = await (Subscriber as any).aggregatePaginate(aggregate, options);
        return list;
    }

    static async getAllActiveEmails(): Promise<string[]> {
        const subscribers = await Subscriber.find({ is_active: true }).select('email').lean();
        return subscribers.map((s) => s.email);
    }

    static async unsubscribe(email: string): Promise<any> {
        const subscriber = await Subscriber.findOne({ email: email.toLowerCase().trim() });
        if (!subscriber) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'Subscriber not found!',
            );
        }
        subscriber.is_active = false;
        await subscriber.save();
        return subscriber;
    }

    static async deleteSubscriber(_id: string): Promise<any> {
        const subscriber = await Subscriber.findByIdAndDelete(_id);
        if (!subscriber) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Not Found',
                'Subscriber not found!',
            );
        }
        return subscriber;
    }

    static async sendWelcomeEmail(email: string): Promise<void> {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:'Helvetica Neue',Arial,sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                                <tr>
                                    <td style="background-color:#1f2937;padding:30px 40px;text-align:center;">
                                        <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:800;letter-spacing:2px;">NEWZIFY</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:40px;">
                                        <h2 style="color:#1f2937;margin:0 0 16px;font-size:24px;">Welcome to Newzify!</h2>
                                        <p style="color:#6b7280;font-size:16px;line-height:1.6;margin:0 0 24px;">
                                            Thank you for subscribing to Newzify. You're now part of our community and will receive the latest news, stories, and updates directly in your inbox.
                                        </p>
                                        <div style="background-color:#fef2f2;border-left:4px solid #dc2626;padding:16px 20px;margin:0 0 24px;border-radius:0 4px 4px 0;">
                                            <p style="color:#991b1b;margin:0;font-size:14px;font-weight:600;">What you'll receive:</p>
                                            <ul style="color:#7f1d1d;margin:8px 0 0;padding-left:20px;font-size:14px;line-height:1.8;">
                                                <li>Breaking news alerts</li>
                                                <li>Weekly top stories roundup</li>
                                                <li>Exclusive editorial content</li>
                                                <li>Latest blog posts and insights</li>
                                            </ul>
                                        </div>
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center">
                                                    <a href="https://newzify-backend-kappa.vercel.app" style="display:inline-block;background-color:#dc2626;color:#ffffff;padding:14px 36px;text-decoration:none;border-radius:6px;font-weight:600;font-size:16px;">Explore Newzify</a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background-color:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;">
                                        <p style="color:#9ca3af;font-size:12px;margin:0;text-align:center;">
                                            You're receiving this because you subscribed to Newzify updates.<br>
                                            &copy; 2024 Newzify. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;

        try {
            await sendUserEmailGeneral({
                email,
                subject: 'Welcome to Newzify - You\'re Subscribed!',
                message: html,
            });
        } catch (error) {
            console.error('Failed to send welcome email:', error);
        }
    }

    static async sendPublishNotification(
        type: 'news' | 'blog',
        title: string,
        slug?: string
    ): Promise<void> {
        const emails = await SubscriberService.getAllActiveEmails();
        if (emails.length === 0) return;

        const contentType = type === 'news' ? 'News Article' : 'Blog Post';
        const baseUrl = 'https://newzify-backend-kappa.vercel.app';
        const link = slug
            ? `${baseUrl}/${type === 'news' ? 'news' : 'blog'}/${slug}`
            : baseUrl;

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:'Helvetica Neue',Arial,sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                                <tr>
                                    <td style="background-color:#1f2937;padding:30px 40px;text-align:center;">
                                        <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:800;letter-spacing:2px;">NEWZIFY</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:40px;">
                                        <div style="display:inline-block;background-color:#dc2626;color:#ffffff;padding:6px 16px;border-radius:20px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:20px;">
                                            New ${contentType}
                                        </div>
                                        <h2 style="color:#1f2937;margin:0 0 16px;font-size:22px;line-height:1.4;">${title}</h2>
                                        <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 30px;">
                                            A new ${contentType.toLowerCase()} has been published on Newzify. Don't miss out on the latest update!
                                        </p>
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center">
                                                    <a href="${link}" style="display:inline-block;background-color:#dc2626;color:#ffffff;padding:14px 36px;text-decoration:none;border-radius:6px;font-weight:600;font-size:16px;">Read Now</a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background-color:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;">
                                        <p style="color:#9ca3af;font-size:12px;margin:0;text-align:center;">
                                            You're receiving this because you subscribed to Newzify updates.<br>
                                            <a href="${baseUrl}/unsubscribe?email=EMAIL_PLACEHOLDER" style="color:#dc2626;">Unsubscribe</a> &nbsp;|&nbsp;
                                            &copy; 2024 Newzify. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;

        const sendToAll = async () => {
            for (const email of emails) {
                try {
                    const personalizedHtml = html.replace('EMAIL_PLACEHOLDER', encodeURIComponent(email));
                    await sendUserEmailGeneral({
                        email,
                        subject: `New ${contentType} on Newzify: ${title}`,
                        message: personalizedHtml,
                    });
                } catch (error) {
                    console.error(`Failed to send notification to ${email}:`, error);
                }
            }
        };

        sendToAll().catch((err) =>
            console.error('Batch notification send failed:', err)
        );
    }
}
