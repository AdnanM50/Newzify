import { Types } from "mongoose";

export type TUser = {
    first_name: string;
    last_name: string;
    image: string;
    phone: string;
    email: string;
    role: string;
    shop_address: string;
    shop_name: string;
    work_experience?: string;
    shop_image: string;
    shop_banner: string;
    password: string;
    about?: string;
    permissions?: Types.ObjectId;
    is_deleted: boolean;
    isModified: (field: string) => boolean;
}

export type TPasswordUpdate = TUser & {
    isModified: (field: string) => boolean;
}
export type TUserExist = {
    _id: Types.ObjectId | undefined;
    email: string | undefined;
    phone: string | undefined;
}
export type TUserQueryParam = {
    _id: Types.ObjectId | undefined;
    email: string | undefined;
    phone: string | undefined;
}
export interface IUserUpdateParameters {
    query: Record<string, any>;
    updateDocument: never;
    session?: never;
}
