import { catchAsync } from '../../utils/catchAsync';
import { PageSettingService } from './page-setting.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const updatePageSettings = catchAsync(async (req, res) => {
    const data = await PageSettingService.updatePageSettings(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Page settings updated successfully',
        data,
    });
});

const getPageSettings = catchAsync(async (req, res) => {
    const data = await PageSettingService.getPageSettings();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Page settings retrieved successfully',
        data,
    });
});

export const PageSettingControllers = {
    updatePageSettings,
    getPageSettings,
};
