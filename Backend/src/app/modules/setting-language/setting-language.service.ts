import Language from './setting-language.model';
import { HttpStatusCode } from 'axios';
import { Types } from 'mongoose';
import AppError from '../../errors/appError';
export class SettingLanguageService {
    static async createLanguage(payload: any) {
        const newLanguage = await Language.create(payload);
        if (!newLanguage) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed',
                'Failed to create new language! Please try again.',
            );
        }
        return newLanguage;
    }
    static async findLanguageById(_id: string | Types.ObjectId) {
        const language = await Language.findById(_id).select('-__v').lean();
        if (!language) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'Language not found!',
            );
        }
        return language;
    }
    static async findLanguageByName(name: string, permissions = true) {
        const language = await Language.findOne({
            name,
        }).lean();
        if (!language && permissions) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'Language not found!',
            );
        }
        return language;
    }
    static async findLanguageByQuery(
        query: Record<
            string,
            string | Types.ObjectId | number | boolean | undefined
        >,
        fields: Record<string, number>,
        permissions: boolean = true,
    ) {
        const language = await Language.findOne(query, fields).lean();
        if (!language && permissions) {
            throw new AppError(404, 'Request Failed', 'Language not found!');
        }
        return language;
    }
    static async findLanguageListByQuery(
        filter: Record<
            string,
            string | Types.ObjectId | number | boolean | undefined
        >,
        fields: string,
        permissions: boolean = true,
    ) {
        const language = await Language.find(filter).select(fields).lean();
        if (!language && permissions) {
            throw new AppError(404, 'Request Failed', 'Language not found!');
        }
        return language;
    }
    static async updateLanguage(
        query: Record<string, string | Types.ObjectId>,
        updateDocument: any,
        session = undefined,
    ) {
        const options = {
            new: true,
            session,
        };
        const updatedLanguage = await Language.findOneAndUpdate(
            query,
            updateDocument,
            options,
        ).lean();
        return updatedLanguage;
    }

    static async updateManyLanguage(
        query: Record<string, string | Types.ObjectId>,
        updateDocument: any,
        session = undefined,
    ) {
        const options = {
            new: true,
            session,
        };
        const updatedLanguage = await Language.updateMany(
            query,
            updateDocument,
            options,
        ).lean();
        return updatedLanguage;
    }
    static async deleteLanguageById(_id: string | Types.ObjectId) {
        const language = await Language.findByIdAndDelete(_id);
        if (!language) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'Language not found!',
            );
        }
        return language;
    }
}
