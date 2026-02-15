import { HttpStatusCode } from "axios";
import AppError from "../../errors/appError";
import User from "./user.model";
import { Types } from "mongoose";
import News from "../news/news.model";
import Comment from "../comment/comment.model";

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
    static async findUserByEmail(email: string, permission: boolean = true): Promise<any> {
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
                    work_experience: 1,
                    createdAt: 1,
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

    // User Profile Features
    static async findLikedPostsByUserId(userId: string | Types.ObjectId, query: any): Promise<any> {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;

        const likedPosts = await News.find({
            likes: userId,
            is_deleted: false,
            status: 'published'
        })
        .populate('category', 'name')
        .populate('author', 'first_name last_name image')
        .select('-__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

        const total = await News.countDocuments({
            likes: userId,
            is_deleted: false,
            status: 'published'
        });

        return {
            docs: likedPosts,
            totalDocs: total,
            limit,
            page,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage: page > 1,
        };
    }

    static async findCommentsByUserId(userId: string | Types.ObjectId, query: any): Promise<any> {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;

        const comments = await Comment.find({
            userId,
            parentCommentId: null, // Only top-level comments
            is_deleted: false
        })
        .populate('newsId', 'title slug')
        .populate('userId', 'first_name last_name image')
        .select('-__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

        // Get reply counts for each comment
        const commentsWithReplies = await Promise.all(
            comments.map(async (comment: any) => {
                const replyCount = await Comment.countDocuments({
                    parentCommentId: comment._id,
                    is_deleted: false
                });
                return {
                    ...comment,
                    replyCount,
                    likeCount: comment.likes?.length || 0
                };
            })
        );

        const total = await Comment.countDocuments({
            userId,
            parentCommentId: null,
            is_deleted: false
        });

        return {
            docs: commentsWithReplies,
            totalDocs: total,
            limit,
            page,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage: page > 1,
        };
    }

    static async findRepliesToUserComments(userId: string | Types.ObjectId, query: any): Promise<any> {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;

        // First, find all comments by the user
        const userComments = await Comment.find({
            userId,
            is_deleted: false
        }).select('_id').lean();

        const userCommentIds = userComments.map(c => c._id);

        // Find all replies to those comments
        const replies = await Comment.find({
            parentCommentId: { $in: userCommentIds },
            is_deleted: false
        })
        .populate('userId', 'first_name last_name image')
        .populate('newsId', 'title slug')
        .populate('parentCommentId', 'content')
        .select('-__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

        const total = await Comment.countDocuments({
            parentCommentId: { $in: userCommentIds },
            is_deleted: false
        });

        return {
            docs: replies,
            totalDocs: total,
            limit,
            page,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage: page > 1,
        };
    }

    static async toggleNewsLike(newsId: string | Types.ObjectId, userId: string | Types.ObjectId): Promise<any> {
        const news = await News.findById(newsId);
        
        if (!news) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'News Not Found',
                'News article not found!',
            );
        }

        const userIdObj = new Types.ObjectId(userId);
        const likes = news.likes || [];
        const userLikeIndex = likes.findIndex((id: Types.ObjectId) => id.equals(userIdObj));

        let isLiked: boolean;
        if (userLikeIndex > -1) {
            // User has already liked, remove the like
            likes.splice(userLikeIndex, 1);
            isLiked = false;
        } else {
            // User hasn't liked, add the like
            likes.push(userIdObj);
            isLiked = true;
        }

        news.likes = likes;
        await news.save();

        return {
            isLiked,
            likeCount: likes.length
        };
    }
}