import mongoose from 'mongoose';
import { app } from '../src/app';
import connectMongo from '../src/app/config/database';
import config from '../src/app/config';

export default async function handler(req: any, res: any) {
    try {
        if (mongoose.connection.readyState === 0) {
            await connectMongo(config.db_string as string);
        }
        return app(req, res);
    } catch (err: any) {
        console.error('API handler error:', err);
        res.statusCode = 500;
        res.end(
            JSON.stringify({
                success: false,
                message: 'Internal server error',
                error: err?.message || 'Unknown error',
            }),
        );
    }
}


