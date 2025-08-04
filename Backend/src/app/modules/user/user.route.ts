import { Router } from "express";
import { UserController } from "./user.controller";
import validate from "../../middleware/validate";
import { UserValidations } from "./user.validation";
// import auth from "../../middleware/auth";
// import { USER_ROLE_ENUM } from "../../utils/constant";
const userRouter = Router();

// userRouter.post('/register', UserController.registerNewAccount);
// userRouter.patch('/update',auth(...USER_ROLE_ENUM),validate(UserValidations.updateUserProfileValidationSchema), UserController.userProfileUpdate);
// userRouter.get('/profile',auth(...USER_ROLE_ENUM), UserController.getUserProfile);
// userRouter.get('/list',auth(...USER_ROLE_ENUM), UserController.getUserList);
// userRouter.get('/seller/list', UserController.sellerList);



export default userRouter