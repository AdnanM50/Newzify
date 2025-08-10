
import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { v2 as cloudinary } from 'cloudinary';
// Import config to ensure Cloudinary is initialized
import '../../../app/config';

export class CloudinaryController {
    static uploadImage = catchAsync(async (req: Request, res: Response) => {
        try {
            if (!req.files || !req.files.image) {
                return res.status(400).json({ message: 'Image is required' });
            }
        
            const imageFile = Array.isArray(req.files.image)
                ? req.files.image[0]
                : req.files.image;
        
            if (!imageFile.tempFilePath) {
                return res.status(400).json({ message: 'Invalid file upload' });
            }
        
            const result = await cloudinary.uploader.upload(imageFile.tempFilePath, {
                folder: 'my_uploads',
            });
        
            return res.status(200).json({
                message: 'Image uploaded successfully',
                url: result.secure_url,
                public_id: result.public_id,
            });
        } catch (error) {
            console.error('Upload error:', error);
            return res.status(500).json({ 
                message: 'Upload failed', 
                error: error instanceof Error ? error.message : 'Unknown error' 
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