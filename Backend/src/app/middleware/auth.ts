import AppError from "../errors/appError";
import User from "../modules/user/user.model";
import { catchAsync } from "../utils/catchAsync";
import config from "../config";
import { HttpStatus } from "http-status";
import jwt,{ JwtPayload } from "jsonwebtoken";
import { HttpStatusCode } from "axios";

const auth = (...requiredRules:any) => {
    return catchAsync(async (req, res, next): Promise<void> => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new AppError(
                HttpStatusCode.Unauthorized,
                'Unauthorized',
                'You are not authorized to access this resource.',
            );
        }
        let decoded;
        try {
            decoded = jwt.verify(
                token as string,
                config.jwt_access_secret as string,
            ) as JwtPayload;
        } catch (error) {
            throw new AppError(
                HttpStatusCode.Unauthorized,
                'Unauthorized',
                'Invalid token.',
            )
        }
        if(!decoded?._id){
            throw new AppError(
                HttpStatusCode.Unauthorized,
                'Unauthorized',
                'Invalid token.',
            )
        }
        const user = await User.findById(decoded._id).populate('permissions')
        .select('-__v -updatedAt')
        .lean();
        if (!user) {
            throw new AppError(
                HttpStatusCode.Unauthorized,
                'Unauthorized',
                'User not found.',
            )
        }
        if (user.is_deleted) {
            throw new AppError(
                HttpStatusCode.Unauthorized,
                'Unauthorized',
                'User not found.',
            )
        }
        // if(requiredRules.length && !requiredRules.includes(user.permissions?.name)) {
        //     throw new AppError(
        //         HttpStatusCode.Forbidden,
        //         'Forbidden',
        //         'You do not have permission to access this resource.',
        //     )
        // }
        res.locals.user = user;
        next()
    })
}
export default auth;