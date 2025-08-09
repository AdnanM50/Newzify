
import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { v2 as cloudinary } from 'cloudinary';
// Import config to ensure Cloudinary is initialized
import '../../../app/config';

export class CloudinaryController {
    static uploadImage = catchAsync(async (req: Request, res: Response) => {
        const { files } = req;
        if (!files?.image) {
            return res.status(400).json({ message: 'Image is required' });
        }

        // Assuming files.image is an array, take the first one
        const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

        const result = await cloudinary.uploader.upload(imageFile.tempFilePath, {
            folder: 'your_folder_name', // Optional: specify a folder in Cloudinary
        });

        return res.status(200).json({
            message: 'Image uploaded successfully',
            data: result,
        });
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