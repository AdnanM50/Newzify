import { Request, Response } from 'express';
import { firebaseUploadFile, firebaseUploadFiles, firebaseDeleteFile, firebaseDeleteFiles } from './file.utils';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

export const uploadSingleFileToFirebase = async (req: Request, res: Response) => {
    try {
        const file = req.files?.file as any;
        
        if (!file) {
            return sendResponse(res, {
                statusCode: httpStatus.BAD_REQUEST,
                success: false,
                message: 'No file provided',
                data: null,
            });
        }

        // Upload file to Firebase Storage
        const uploadedFileUrl = await firebaseUploadFile(file, 'uploads');
        
        return sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'File uploaded successfully',
            data: {
                fileUrl: uploadedFileUrl,
                fileName: file.name,
                fileSize: file.size,
            },
        });
    } catch (error) {
        return sendResponse(res, {
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: 'Error uploading file',
            data: null,
        });
    }
};

export const uploadMultipleFilesToFirebase = async (req: Request, res: Response) => {
    try {
        const files = req.files?.files;
        
        if (!files || (Array.isArray(files) && files.length === 0)) {
            return sendResponse(res, {
                statusCode: httpStatus.BAD_REQUEST,
                success: false,
                message: 'No files provided',
                data: null,
            });
        }

        // Convert single file to array if needed
        const fileArray = Array.isArray(files) ? files : [files];
        
        // Upload files to Firebase Storage
        const uploadedFileUrls = await firebaseUploadFiles(fileArray, 'uploads');
        
        return sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Files uploaded successfully',
            data: {
                fileUrls: uploadedFileUrls,
                fileCount: fileArray.length,
            },
        });
    } catch (error) {
        return sendResponse(res, {
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: 'Error uploading files',
            data: null,
        });
    }
};

export const deleteFileFromFirebase = async (req: Request, res: Response) => {
    try {
        const { fileUrl } = req.body;
        
        if (!fileUrl) {
            return sendResponse(res, {
                statusCode: httpStatus.BAD_REQUEST,
                success: false,
                message: 'File URL is required',
                data: null,
            });
        }

        // Delete file from Firebase Storage
        await firebaseDeleteFile(fileUrl);
        
        return sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'File deleted successfully',
            data: null,
        });
    } catch (error) {
        return sendResponse(res, {
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: 'Error deleting file',
            data: null,
        });
    }
};

export const deleteMultipleFilesFromFirebase = async (req: Request, res: Response) => {
    try {
        const { fileUrls } = req.body;
        
        if (!fileUrls || !Array.isArray(fileUrls) || fileUrls.length === 0) {
            return sendResponse(res, {
                statusCode: httpStatus.BAD_REQUEST,
                success: false,
                message: 'File URLs array is required',
                data: null,
            });
        }

        // Delete files from Firebase Storage
        await firebaseDeleteFiles(fileUrls);
        
        return sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Files deleted successfully',
            data: {
                deletedCount: fileUrls.length,
            },
        });
    } catch (error) {
        return sendResponse(res, {
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: 'Error deleting files',
            data: null,
        });
    }
}; 