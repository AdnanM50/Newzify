
import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { v2 as cloudinary } from 'cloudinary';
// Import config to ensure Cloudinary is initialized
import '../../../app/config';

export class CloudinaryController {
    // Helper function to validate and log file details
    private static validateFile(file: any, fieldName: string) {
        console.log(`File validation for field: ${fieldName}`);
        console.log('File object:', {
            name: file?.name,
            size: file?.size,
            mimetype: file?.mimetype,
            hasData: !!file?.data,
            hasTempFilePath: !!file?.tempFilePath,
            mv: typeof file?.mv,
            encoding: file?.encoding,
            truncated: file?.truncated
        });
        
        return {
            isValid: !!(file?.data || file?.tempFilePath),
            hasData: !!file?.data,
            hasTempFilePath: !!file?.tempFilePath,
            size: file?.size,
            mimetype: file?.mimetype
        };
    }

    // Helper function to validate Cloudinary configuration
    private static validateCloudinaryConfig() {
        const config = cloudinary.config();
        const isValid = !!(config.cloud_name && config.api_key && config.api_secret);
        
        if (!isValid) {
            console.error('Cloudinary configuration is missing:', {
                hasCloudName: !!config.cloud_name,
                hasApiKey: !!config.api_key,
                hasApiSecret: !!config.api_secret
            });
        }
        
        return isValid;
    }

    static uploadImage = catchAsync(async (req: Request, res: Response) => {
        try {
            console.log('Upload request received');
            console.log('Request headers:', req.headers);
            console.log('Request body keys:', req.body ? Object.keys(req.body) : 'No body');
            console.log('Request files:', req.files ? 'Files present' : 'No files');
            console.log('Request files keys:', req.files && typeof req.files === 'object' ? Object.keys(req.files) : 'No files object');

            // Validate Cloudinary configuration first
            if (!this.validateCloudinaryConfig()) {
                return res.status(500).json({
                    message: 'File upload service not configured',
                    error: 'Cloudinary configuration is missing or invalid'
                });
            }

            // Check if files exist in the request
            if (!req.files || typeof req.files !== 'object') {
                return res.status(400).json({ 
                    message: 'No files were uploaded',
                    error: 'req.files is undefined or not an object',
                    contentType: req.headers['content-type'],
                    hasFiles: !!req.files,
                    filesType: typeof req.files
                });
            }

            // Check if image field exists
            if (!req.files.image) {
                const availableFields = req.files && typeof req.files === 'object' ? Object.keys(req.files) : [];
                return res.status(400).json({ 
                    message: 'Image field is required',
                    error: 'Please use "image" as the field name in your form data',
                    availableFields: availableFields
                });
            }

            const imageFile = Array.isArray(req.files.image)
                ? req.files.image[0]
                : req.files.image;

            // Validate file object
            if (!imageFile || typeof imageFile !== 'object') {
                return res.status(400).json({ 
                    message: 'Invalid file object',
                    error: 'File object is malformed'
                });
            }

            // Validate file using helper function
            const validation = this.validateFile(imageFile, 'image');
            console.log('File validation result:', validation);

            // Check if file has data (for buffer uploads) or tempFilePath (for temp file uploads)
            if (!validation.isValid) {
                return res.status(400).json({ 
                    message: 'Invalid file upload',
                    error: 'File has no data or tempFilePath',
                    fileInfo: {
                        name: imageFile.name,
                        size: imageFile.size,
                        mimetype: imageFile.mimetype,
                        hasData: validation.hasData,
                        hasTempFilePath: validation.hasTempFilePath
                    },
                    validation: validation
                });
            }

            let uploadResult;
            
            // If file has tempFilePath, use it (for multipart form data)
            if (imageFile.tempFilePath) {
                console.log('Using tempFilePath for upload:', imageFile.tempFilePath);
                uploadResult = await cloudinary.uploader.upload(imageFile.tempFilePath, {
                    folder: 'my_uploads',
                });
            } 
            // If file has data buffer, convert to temp file first
            else if (imageFile.data) {
                console.log('Using data buffer for upload, creating temp file');
                // Create a temporary file path
                const tempPath = require('path').join(require('os').tmpdir(), `temp_${Date.now()}_${imageFile.name}`);
                require('fs').writeFileSync(tempPath, imageFile.data);
                
                try {
                    uploadResult = await cloudinary.uploader.upload(tempPath, {
                        folder: 'my_uploads',
                    });
                } finally {
                    // Clean up temp file
                    if (require('fs').existsSync(tempPath)) {
                        require('fs').unlinkSync(tempPath);
                    }
                }
            }

            if (!uploadResult) {
                return res.status(500).json({ 
                    message: 'Upload failed',
                    error: 'Could not process file upload'
                });
            }

            console.log('Upload successful:', uploadResult.secure_url);

            return res.status(200).json({
                message: 'Image uploaded successfully',
                url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
                fileInfo: {
                    name: imageFile.name,
                    size: imageFile.size,
                    mimetype: imageFile.mimetype
                }
            });
        } catch (error) {
            console.error('Upload error:', error);
            return res.status(500).json({ 
                message: 'Upload failed', 
                error: error instanceof Error ? error.message : 'Unknown error',
                details: error instanceof Error ? error.stack : undefined
            });
        }
    });

    static deleteImage = catchAsync(async (req: Request, res: Response) => {
        const { public_id } = req.body; // Get the public_id from the request body
        if (!public_id) {
            return res.status(400).json({ message: 'Public ID is required' });
        }

        await cloudinary.uploader.destroy(public_id);
        return res.status(200).json({ message: 'Image deleted successfully' });
    });
}