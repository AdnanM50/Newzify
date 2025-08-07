import config from '../../config';
import path from 'node:path';
import * as fs from 'node:fs';
import { SettingService } from '../setting/setting.service';
import { generateID } from '../../utils/helper';
import { bucket } from '../../config/firebase';


export const localUploadFile = async (file: any, folder: string) => {
    if (!file) return Promise.resolve('');
    // eslint-disable-next-line no-undef
    const uploadDir = path.join(__dirname, '../../../../', 'public', folder);
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    const setting = await SettingService.getSettingsBySelect('server_side_url');
    const filename =
        file.name
            .replace(path.extname(file.name), '')
            .toLowerCase()
            .split(' ')
            .join('-') +
        '-' +
        Date.now() +
        path.extname(file.name);
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, file.data);
    return Promise.resolve(
        setting.server_side_url +
            '/' +
            filePath.substring(filePath.indexOf('public')),
    );
};
export const localUploadFiles = async (files: any, folder: string) => {
    if (files.length === 0) return Promise.resolve([]);
    // eslint-disable-next-line no-undef
    const uploadDir = path.join(__dirname, '../../../../', 'public', folder);
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    const setting = await SettingService.getSettingsBySelect('server_side_url');
    const params = files.map((file: any) => {
        const filename =
            file.name
                .replace(path.extname(file.name), '')
                .toLowerCase()
                .split(' ')
                .join('-') +
            '-' +
            Date.now() +
            path.extname(file.name);
        return {
            uploadDir: path.join(uploadDir, filename),
            body: file.data,
        };
    });
    return await Promise.all(
        params.map(async (param: any) => {
            fs.writeFileSync(param.uploadDir, param.body);
            return (
                setting.server_side_url +
                '/' +
                param.uploadDir.substring(param.uploadDir.indexOf('public'))
            );
        }),
    );
};
export const localDeleteFiles = async (files: any) => {
    if (files.length === 0) return Promise.resolve([]);
    // eslint-disable-next-line no-undef
    const removeDir = path.join(__dirname, '../../../../');
    files.map((file: any) => {
        const removeFile =
            removeDir + '/' + file.substring(file.indexOf('public'));
        if (fs.existsSync(removeFile)) {
            fs.unlinkSync(removeFile);
        }
    });
    return await Promise.all(files);
};

// Firebase Storage Functions
export const firebaseUploadFile = async (file: any, folder: string) => {
    if (!file) return Promise.resolve('');
    
    if (!bucket) {
        throw new Error('Firebase Storage is not configured. Please add Firebase credentials to your .env file.');
    }
    
    const filename = `${generateID('', 8)}-${file.name}`.split(' ').join('-');
    const filePath = `${config.website_name}-storage/${folder}/${filename}`;
    
    const fileBuffer = file.data;
    const fileUpload = bucket.file(filePath);
    
    await fileUpload.save(fileBuffer, {
        metadata: {
            contentType: file.mimetype || 'application/octet-stream',
        },
        public: true,
    });
    
    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${config.firebase_storage_bucket}/${filePath}`;
    return Promise.resolve(publicUrl);
};

export const firebaseUploadFiles = async (files: any, folder: string) => {
    if (files.length === 0) return Promise.resolve([]);
    
    const uploadPromises = files.map(async (file: any) => {
        return await firebaseUploadFile(file, folder);
    });
    
    return await Promise.all(uploadPromises);
};

export const firebaseDeleteFile = async (fileUrl: string) => {
    if (!fileUrl) return Promise.resolve();
    
    if (!bucket) {
        console.log('Firebase Storage is not configured. Skipping file deletion.');
        return Promise.resolve();
    }
    
    try {
        // Extract the file path from the URL
        const urlParts = fileUrl.split('/');
        const bucketName = urlParts[3]; // storage.googleapis.com/[bucket]/[path]
        const filePath = urlParts.slice(4).join('/');
        
        if (bucketName === config.firebase_storage_bucket) {
            const file = bucket.file(filePath);
            await file.delete();
        }
    } catch (error) {
        console.error('Error deleting file from Firebase:', error);
    }
    
    return Promise.resolve();
};

export const firebaseDeleteFiles = async (fileUrls: string[]) => {
    if (fileUrls.length === 0) return Promise.resolve();
    
    const deletePromises = fileUrls.map(async (fileUrl: string) => {
        return await firebaseDeleteFile(fileUrl);
    });
    
    return await Promise.all(deletePromises);
};
