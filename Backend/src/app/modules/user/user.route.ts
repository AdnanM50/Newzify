import { Router } from "express";
import { UserController } from "./user.controller";
import validate from "../../middleware/validate";
import { UserValidations } from "./user.validation";
import auth from "../../middleware/auth";
import { USER_ROLE_ENUM } from "../../utils/constant";
const userRouter = Router();


userRouter.patch('/update',auth(...USER_ROLE_ENUM),validate(UserValidations.updateUserProfileValidationSchema), UserController.userProfileUpdate);
userRouter.get('/profile',auth(...USER_ROLE_ENUM), UserController.getUserProfile);

// User Profile Features
userRouter.get('/profile/liked-posts', auth(...USER_ROLE_ENUM), UserController.getLikedPosts);
userRouter.get('/profile/comments', auth(...USER_ROLE_ENUM), UserController.getUserComments);
userRouter.get('/profile/replies', auth(...USER_ROLE_ENUM), UserController.getUserReplies);
userRouter.patch('/profile/toggle-like/:newsId', auth(...USER_ROLE_ENUM), UserController.toggleNewsLike);

// Admin only routes
userRouter.get('/list', auth('admin'), UserController.getUserList);
userRouter.post('/create-reporter', auth('admin'), validate(UserValidations.createReporterValidationSchema), UserController.createNewReporter);
userRouter.delete('/delete/:id', auth('admin'), UserController.deleteUser);
userRouter.patch('/reset-password', auth('admin'), validate(UserValidations.resetPasswordValidationSchema), UserController.resetUserPassword);

export default userRouter