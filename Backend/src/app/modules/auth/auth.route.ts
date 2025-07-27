import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthValidations } from "./auth.validation";
import validate from "../../middleware/validate";
import { USER_ROLE_ENUM } from "../../utils/constant";
import auth from "../../middleware/auth";

const authRouter = Router();
authRouter.post("/login",
    
    AuthController.loginAccess)
authRouter.post(
    '/forget-password/verify-otp',
    
    AuthController.forgetPasswordOTPVerify,
);
authRouter.post(
    '/forget-password/submit',
    auth(...USER_ROLE_ENUM),
  
    AuthController.forgetPasswordSubmitTokenBased,
);
authRouter.patch(
    '/password-update',
   
    auth(...USER_ROLE_ENUM),
    AuthController.userPasswordUpdate,
);

export default authRouter;