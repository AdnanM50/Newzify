import { Router } from 'express';
import { CloudinaryController } from './file.controller';

const router = Router();

router.post('/single-image-upload', CloudinaryController.uploadImage);
router.delete('/delete', CloudinaryController.deleteImage);

export const fileRouters: Router = router;
