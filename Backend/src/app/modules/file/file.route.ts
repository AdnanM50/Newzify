import { Router } from 'express';
import { CloudinaryController } from './file.controller';

const router = Router();

// Test endpoint to check if file upload middleware is working
router.post('/test-upload', (req, res) => {
    console.log('=== TEST UPLOAD ENDPOINT ===');
    console.log('Headers:', req.headers);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Has files:', !!req.files);
    console.log('Files type:', typeof req.files);
    console.log('Files keys:', req.files && typeof req.files === 'object' ? Object.keys(req.files) : 'No files');
    console.log('Body keys:', req.body ? Object.keys(req.body) : 'No body');
    
    res.json({
        message: 'File upload test endpoint',
        hasFiles: !!req.files,
        filesType: typeof req.files,
        files: req.files && typeof req.files === 'object' ? Object.keys(req.files) : [],
        body: req.body ? Object.keys(req.body) : [],
        contentType: req.headers['content-type']
    });
});

router.post('/single-image-upload', CloudinaryController.uploadImage);
router.delete('/delete', CloudinaryController.deleteImage);

export const fileRouters: Router = router;
