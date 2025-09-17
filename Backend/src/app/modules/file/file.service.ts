import File from './file.model';
import type { IFile } from './file.model';
import { generateID } from '../../utils/helper';

export class FileService {
    static async createFile(fileData: Partial<IFile>): Promise<IFile> {
        const file = new File(fileData);
        return await file.save();
    }

    static async getFileById(id: string): Promise<IFile | null> {
        return await File.findById(id);
    }

    static async getFileByUrl(fileUrl: string): Promise<IFile | null> {
        return await File.findOne({ fileUrl, isActive: true });
    }

    static async getFilesByFolder(folder: string, uploadedBy?: string): Promise<IFile[]> {
        const query: any = { folder, isActive: true };
        if (uploadedBy) {
            query.uploadedBy = uploadedBy;
        }
        return await File.find(query).sort({ createdAt: -1 });
    }

    static async getFilesByUser(uploadedBy: string): Promise<IFile[]> {
        return await File.find({ uploadedBy, isActive: true }).sort({ createdAt: -1 });
    }

    static async updateFile(id: string, updateData: Partial<IFile>): Promise<IFile | null> {
        return await File.findByIdAndUpdate(id, updateData, { new: true });
    }

    static async deleteFile(id: string): Promise<IFile | null> {
        return await File.findByIdAndUpdate(id, { isActive: false }, { new: true });
    }

    static async deleteFileByUrl(fileUrl: string): Promise<IFile | null> {
        return await File.findOneAndUpdate(
            { fileUrl },
            { isActive: false },
            { new: true }
        );
    }

    static async getFileStats(uploadedBy?: string): Promise<{
        totalFiles: number;
        totalSize: number;
        filesByType: { [key: string]: number };
    }> {
        const query: any = { isActive: true };
        if (uploadedBy) {
            query.uploadedBy = uploadedBy;
        }

        const files = await File.find(query);
        
        const totalFiles = files.length;
        const totalSize = files.reduce((sum: number, file: IFile) => sum + (file.size || 0), 0);
        
        const filesByType: { [key: string]: number } = {};
        files.forEach((file: IFile) => {
            const type = (file.mimeType || '').split('/')[0];
            filesByType[type] = (filesByType[type] || 0) + 1;
        });

        return { totalFiles, totalSize, filesByType };
    }
} 