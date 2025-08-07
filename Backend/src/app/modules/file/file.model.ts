import { model, Schema } from 'mongoose';

export interface IFile {
    originalName: string;
    fileName: string;
    fileUrl: string;
    filePath: string;
    mimeType: string;
    size: number;
    uploadType: 'local' | 'firebase';
    folder: string;
    uploadedBy?: string;
    isActive: boolean;
}

const fileSchema = new Schema<IFile>(
    {
        originalName: {
            type: String,
            required: true,
        },
        fileName: {
            type: String,
            required: true,
        },
        fileUrl: {
            type: String,
            required: true,
        },
        filePath: {
            type: String,
            required: true,
        },
        mimeType: {
            type: String,
            required: true,
        },
        size: {
            type: Number,
            required: true,
        },
        uploadType: {
            type: String,
            enum: ['local', 'firebase'],
            default: 'local',
        },
        folder: {
            type: String,
            required: true,
        },
        uploadedBy: {
            type: String,
            ref: 'user',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for better query performance
fileSchema.index({ uploadedBy: 1, folder: 1, isActive: 1 });
fileSchema.index({ fileUrl: 1 });

const File = model<IFile>('file', fileSchema);

export default File;
