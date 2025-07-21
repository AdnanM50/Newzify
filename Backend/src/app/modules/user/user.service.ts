import { HttpStatusCode } from "axios";
import AppError from "../../errors/appError";
import User from "./user.model";
import { Types } from "mongoose";

export default class UserService {
    static async createNewUser(payload: any): Promise<any> {
        const newUser = await User.create(payload);
        if (!newUser) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed',
                'Failed to create account! Please try again.',
            );
        }
        return newUser;
    }
    static async findUserById(_id: string): Promise<any> {
        const user = await User.findById(_id)
        .select('-password -__v -updatedAt')
        .lean();
        if (!user) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'User Not Found',
                'User not found!',
            );
        }
        return user;
    }
    static async findUserByPhone(phone: string,permission=true): Promise<any> {
        const user = await User.findOne({ phone })
        .select('-__v -updatedAt')
        .lean();
        if (!user && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'User Not Found',
                'User not found!',
            );
        }
        return user;
    }
    static async findUserByEmail(email: string,permission:true): Promise<any> {
        const user = await User.findOne({ email })
        .select('-__v -updatedAt')
        .lean();
        if (!user && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'User Not Found',
                'User not found!',
            );
        }
        return user;
    }
    static async findByEmailOrPhone(email: string, phone: string): Promise<any> {
        const user = await User.findOne({
            $or: [
                { email },
                { phone }
            ]
        })
        .select('-password -__v -updatedAt')
        .lean();
        if (!user) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'User Not Found',
                'User not found!',
            );
        }
        return user;
    }
    static async checkUserExists(email: string, phone: string): Promise<any> {
        const user = await User.findOne({
            $or: [
                { email },
                { phone }
            ]
        })
        .select('-password -__v -updatedAt')
        .lean();
        return user;
    }
    static async findUserListByQuery(filter: any, query: any, permission: any=true): Promise<any> {
        const aggregate = User.aggregate([
            {
                $match:filter
            },
            {
                $lookup: {
                    from: 'hrm_roles',
                    localField: 'permissions',
                    pipeline: [
                        {
                            $project: {
                                _id: 0,
                                name: 1,
                            },
                        },
                    ],
                    foreignField: '_id',
                    as: 'permissions',
                }
            },
            {
                $unwind: {
                    path: '$permissions',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    first_name: 1,
                    last_name: 1,
                    email: 1,
                    phone: 1,
                    role: 1,
                    permissions: 1,
                    image: 1,
                },
            },
        ]);
        const options = {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
        };
        const user = await User.aggregatePaginate(aggregate, options);
        if (!user.docs.length && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'User list not found!',
            );
        }
        return user;
    }

    static async updateUserProfile(
        query:Record<string, string | Types.ObjectId>,
        updateDocument:any,
        session: any=undefined,
    ): Promise<any> {
        const options = {
            new: true,
            session,
        };
        const user = await User.findOneAndUpdate(query, updateDocument, options).lean();
        return user;
    }
    static async deleteUserById(_id: string | Types.ObjectId) {
        const user = await User.findByIdAndUpdate(_id, {
            is_deleted: true,
        }).lean();
        if (!user) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'User not found!',
            );
        }
        return user;
    }
    // static async allSellerListByQuery(filter,query: any): Promise<any> {
    //     const aggregate = User.aggregate([
    //         {
    //             $match:filter
    //         },
    //         {
    //             $project: {
    //                 _id: 1,
    //                 first_name: 1,
    //                 last_name: 1,
    //                 email: 1,
    //                 phone: 1,
    //                 role: 1,
    //                 image: 1,
    //                 shop_address:1,
    //                 shop_name:1,
    //                 shop_image:1,
    //                 shop_banner:1
    //             },
    //         },
    //     ])
    //     const options = {
    //         page: query.page || 1,
    //         limit: query.limit || 10,
    //         sort: { createdAt: -1 },
    //     };
    //     const sellers = await User.aggregatePaginate(aggregate,options)
    //     if(!sellers.docs.length){
    //         throw new AppError(
    //             HttpStatusCode.NotFound,
    //             'Request Failed',
    //             'Sellers not found!',
    //         )
    //     }
    //     return sellers;
    // }
}