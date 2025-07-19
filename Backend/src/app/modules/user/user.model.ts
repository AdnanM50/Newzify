import { model,Schema } from "mongoose";
import { TUser,TUserExist } from "./user.interface";
import { USER_ROLE_ENUM } from "../../utils/constant";
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import bcrypt from 'bcrypt';
import config from '../../config';
import AppError from '../../errors/appError';
import httpStatus from 'http-status';

const schema = new Schema<TUser>(
    {
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            enum: {
                values: USER_ROLE_ENUM,
                message: '{VALUE} is not a valid role',
            },
            default: 'user',
            required: true,
        },
        country: String,
        city: String,
        state: String,
        zip_code: String,
        shop_address: String,
        shop_name: String,
        shop_image: String,
        shop_banner: String,
        about: {
            type: String,
            default: '',
        },
        password: {
            type: String,
            required: true,
        },
        permissions: {
            type: Schema.Types.ObjectId,
            ref: 'hrm_role',
        },
        is_deleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true
    }
)

schema.pre<TUser>('save', async function (next): Promise<void> {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = Number(config.bcrypt_salt_rounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})
schema.post<TUser>('save', async function (doc: any, next): Promise<void> {
    doc.__v = undefined;
    next();
})

schema.statics.isPasswordMatch = async function (password: string, hashPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
}

schema.statics.isUserExist = async function ({_id, email, phone}: TUserExist): Promise<any | null> {
    const user = await this.findOne({
        $or: [{ _id }, { email }, { phone }],    
    });
    if (!user) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Invalid input',
            'User not found !',
        );
    }
    return user;
}

schema.plugin(aggregatePaginate);
const User = model<TUser, any>('user', schema);
export default User;