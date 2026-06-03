import { v2 as cloudinary } from 'cloudinary';
import '../config'; // Ensure config is loaded

export const deleteImageFromCloudinary = async (imageUrl: string) => {
    try {
        if (!imageUrl) return false;
        
        // Example URL: https://res.cloudinary.com/dnol6cinc/image/upload/v1780497744/my_uploads/tayvsxdmeonjg8qqiv9g.png
        const parts = imageUrl.split('/upload/');
        if (parts.length < 2) return false;
        
        let path = parts[1];
        // Remove version number if present (e.g., v1780497744/)
        path = path.replace(/^v\d+\//, '');
        // Remove file extension
        const publicId = path.replace(/\.[^/.]+$/, "");
        
        if (publicId) {
            await cloudinary.uploader.destroy(publicId);
            console.log(`Deleted image from Cloudinary: ${publicId}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Failed to delete image from Cloudinary", error);
        return false;
    }
};
