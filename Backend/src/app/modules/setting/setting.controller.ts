import { catchAsync } from '../../utils/catchAsync';
import { SettingService } from './setting.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

import connectMongo from '../../config/database';
import fs from 'node:fs';
import path from 'node:path';
import config from '../../config';
import AppError from '../../errors/appError';
import { seedAdmin } from '../../utils/seeders';
import { generateID } from '../../utils/helper';

const postSiteSettings = catchAsync(async (req, res) => {
    const { body } = req.body;
    await SettingService.postSiteSettings(body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Settings updated successfully',
        data: undefined,
    });
});
const getSiteSettings = catchAsync(async (req, res) => {
    const data = await SettingService.getSiteSettings();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Settings get successfully',
        data,
    });
});
const getSettings = catchAsync(async (req, res) => {
    const { query } = req;
    const localFields =
        typeof query.fields === 'string'
            ? query.fields.split(',').join(' ')
            : '-updatedAt -__v';
    const data = await SettingService.getSettings({}, localFields);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Settings get successfully',
        data,
    });
});

const postSettingEnvBYAdmin = catchAsync( async (req, res) => {
    const { adminInfo, valueString } = req.body;
    const valueENV:any = Object.entries(valueString)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n");
    const envValues = valueENV  + "\n" + `BCRYPT_SALT_ROUNDS=10` + "\n" + `PORT=2025` + "\n" + `JWT_ACCESS_SECRET=${generateID("RANDOM",20)+ Date.now()}` + "\n" + `JWT_ACCESS_EXPIRES_IN="30d"` + "\n" + `JWT_REFRESH_SECRET=${generateID("RANDOM",20) + Date.now()}` + "\n" + `JWT_REFRESH_EXPIRES_IN="30d"`;

    if (adminInfo?.password !== adminInfo?.confirmPassword) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Request Failed",
            "Password invalid"
        )
    }
    await connectMongo(valueString.DATABASE_URL as  string);
    await seedAdmin({adminInfo ,valueString});

    const file = path.join(__dirname, `./../../../../.env${valueString.NODE_ENV === 'prod' ? '.prod': ".dev"}`);
    fs.writeFileSync(file , envValues);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Settings env created successfully',
        data:{
            status: true,
            env: true
        }
    });
});

const checkSettingEnv = catchAsync(async (req, res) => {
    const envFilePath = path.resolve(`.env${config.node_env  === 'prod' ? '.prod' : '.dev'}`);
    const exist =  fs.existsSync(envFilePath);
    if (!exist) {
        sendResponse( res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Settings env get successfully',
            data:{
                status: true,
                env: false
            }
        });
    }
    sendResponse( res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Settings env get successfully',
        data:{
            status: true,
            env: true
        }
    });
    await connectMongo(config.db_string as string);
})
export const SettingControllers = {
    checkSettingEnv,
    postSettingEnvBYAdmin,
    postSiteSettings,
    getSiteSettings,
    getSettings,
};
