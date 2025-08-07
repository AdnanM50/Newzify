import { catchAsync } from '../../utils/catchAsync';
import {
    localDeleteFiles,
    localUploadFile,
    localUploadFiles,
    firebaseUploadFile,
    firebaseUploadFiles,
    firebaseDeleteFile,
    firebaseDeleteFiles,
} from './file.utils';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { SettingService } from '../setting/setting.service';
import { FileService } from './file.service';
import AppError from '../../errors/appError';

export class FileController {
    static singleImageUpload = catchAsync(async (req, res) => {
        const { body, files }: any = req;
        if (!files?.image) {
            throw new AppError(400, 'Invalid Request', 'Image is required');
        }
        const mimetypes = [
            'image/png',
            'image/jpeg',
            'image/webp',
            'image/jpg',
        ];
        if (!mimetypes.includes(files?.image?.mimetype)) {
            throw new AppError(
                404,
                'Invalid Request',
                'Only the image file is acceptable',
            );
        }
        const image_name: string = body.image_file_name || 'image';
        let imageUrl: string = '';
        const setting =
            await SettingService.getSettingsBySelect('file_upload_type');
        
        if (setting.file_upload_type == 'firebase') {
            imageUrl = await firebaseUploadFile(files.image, image_name);
        } else if (setting.file_upload_type == 'local') {
            imageUrl = await localUploadFile(files.image, image_name);
        }

        // Save file information to database
        const fileData = {
            originalName: files.image.name,
            fileName: files.image.name,
            fileUrl: imageUrl,
            filePath: imageUrl,
            mimeType: files.image.mimetype,
            size: files.image.size,
            uploadType: setting.file_upload_type,
            folder: image_name,
            uploadedBy: undefined, // No user authentication required
        };

        const savedFile = await FileService.createFile(fileData);

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: `Image uploaded successfully.`,
            data: {
                file: savedFile,
                imageUrl,
            },
        });
    });
    static singlePdfUpload = catchAsync(async (req, res) => {
        const { body, files }: any = req;
        if (!files?.pdf) {
            throw new AppError(400, 'Invalid Request', 'Image is required');
        }
        const mimetypes = ['application/pdf'];
        if (!mimetypes.includes(files?.pdf?.mimetype)) {
            throw new AppError(
                404,
                'Invalid Request',
                'Only the pdf file is acceptable',
            );
        }
        const image_name: string = body.file_name || 'pdf';
        let data: any = null;
        const setting =
            await SettingService.getSettingsBySelect('file_upload_type');
        if (setting.file_upload_type == 'firebase') {
            data = await firebaseUploadFile(files.pdf, image_name);
        } else if (setting.file_upload_type == 'local') {
            data = await localUploadFile(files.pdf, image_name);
        }

        // Save file information to database
        const fileData = {
            originalName: files.pdf.name,
            fileName: files.pdf.name,
            fileUrl: data,
            filePath: data,
            mimeType: files.pdf.mimetype,
            size: files.pdf.size,
            uploadType: setting.file_upload_type,
            folder: image_name,
            uploadedBy: undefined, // No user authentication required
        };

        const savedFile = await FileService.createFile(fileData);

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: `PDF file uploaded successfully.`,
            data: {
                file: savedFile,
                fileUrl: data,
            },
        });
    });
    static multipleImageUpload = catchAsync(async (req, res) => {
        const { body, files }: any = req;
        if (!files?.images) {
            throw new AppError(400, 'Invalid Request', 'Images are required');
        }
        if (!Array.isArray(files?.images)) {
            files.images = [files.images];
        }

        const invalid = files?.images?.find(
            (file: any) =>
                !['image/jpeg', 'image/png', 'image/jpg'].includes(
                    file?.mimetype,
                ),
        );
        if (invalid) {
            throw new AppError(
                400,
                'Invalid Request',
                'Only jpeg , png and jpg files are allowed for images',
            );
        }

        const image_name = body.image_file_name || 'image';
        let images: any = null;
        const setting =
            await SettingService.getSettingsBySelect('file_upload_type');
        if (setting.file_upload_type == 'firebase') {
            images = await firebaseUploadFiles(files?.images || [], image_name);
        } else if (setting.file_upload_type == 'local') {
            images = await localUploadFiles(files.images || [], image_name);
        }
        // Save file information to database for each image
        const savedFiles = [];
        for (let i = 0; i < files.images.length; i++) {
            const fileData = {
                originalName: files.images[i].name,
                fileName: files.images[i].name,
                fileUrl: images[i],
                filePath: images[i],
                mimeType: files.images[i].mimetype,
                size: files.images[i].size,
                uploadType: setting.file_upload_type,
                folder: image_name,
                uploadedBy: undefined, // No user authentication required
            };
            const savedFile = await FileService.createFile(fileData);
            savedFiles.push(savedFile);
        }

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: `Images uploaded successfully.`,
            data: {
                files: savedFiles,
                imageUrls: images,
            },
        });
    });
    static removeImage = catchAsync(async (req, res) => {
        const { body }: any = req;
        if (!body.file) {
            throw new AppError(400, 'Invalid Request', 'File are required');
        }
        const setting =
            await SettingService.getSettingsBySelect('file_upload_type');
        if (setting.file_upload_type == 'firebase') {
            await firebaseDeleteFile(body?.file);
        } else if (setting.file_upload_type == 'local') {
            await localDeleteFiles([body?.file]);
        }

        // Also delete from database
        await FileService.deleteFileByUrl(body?.file);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'File removed successfully',
            data: null,
        });
    });
}
