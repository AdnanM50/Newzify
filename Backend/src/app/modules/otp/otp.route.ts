import { Router } from 'express';
import { OTPController } from './otp.controller';

const router = Router();

router.post('/send', OTPController.sendOTP);

export const otpRoutes: Router = router;
