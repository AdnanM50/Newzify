import { Schema, model, Document } from 'mongoose';

export interface IFile {
    fileUrl: string;
    publicId?: string;
    originalName?: string;
    mimeType: string;
    size: number;
    folder?: string;
    uploadedBy?: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

type IFileDocument = IFile & Document;

const fileSchema = new Schema<IFileDocument>(
    {
        fileUrl: { type: String, required: true },
        publicId: { type: String },
        originalName: { type: String },
        mimeType: { type: String, required: true },
        size: { type: Number, required: true },
        folder: { type: String },
        uploadedBy: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const File = model<IFileDocument>('file', fileSchema);

export default File;
export { IFileDocument };


