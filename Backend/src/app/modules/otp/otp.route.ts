import { Router } from 'express';
import { OTPController } from './otp.controller';
import validate from '../../middleware/validate';
import { OTPValidations } from './otp.validation';

const router = Router();

router.post(
    '/send',
 
    OTPController.sendOTP,
);

export const otpRoutes: Router = router;
