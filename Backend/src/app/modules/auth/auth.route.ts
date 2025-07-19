import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthValidations } from "./auth.validation";
import validate from "../../middleware/validate";
import { USER_ROLE_ENUM } from "../../utils/constant";
import auth from "../../middleware/auth";

const authRouter = Router();
authRouter.post("/login",
    validate(AuthValidations.userLoginValidationSchema),
    AuthController.loginAccess)
authRouter.post(
    '/forget-password/verify-otp',
    validate(AuthValidations.forgetPasswordOtpVerify),
    AuthController.forgetPasswordOTPVerify,
);
authRouter.post(
    '/forget-password/submit',
    auth(...USER_ROLE_ENUM),
    validate(AuthValidations.forgetPasswordValidationSchema),
    AuthController.forgetPasswordSubmitTokenBased,
);
authRouter.patch(
    '/password-update',
    validate(AuthValidations.passwordUpdateValidationSchema),
    auth(...USER_ROLE_ENUM),
    AuthController.userPasswordUpdate,
);

export default authRouter;