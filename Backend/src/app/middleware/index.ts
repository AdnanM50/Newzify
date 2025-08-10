import morgan from 'morgan';
import config from './../config';
import compression from 'compression';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import path from 'path';
import os from 'os';

const customHeader = (
    _req: Request,
    res: Response,
    next: NextFunction,
): void => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
    );
    res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
    next();
};

const middleware = [
    morgan(config.node_env == 'dev' ? 'dev' : 'combined'),
    compression(),
    // File upload middleware must come BEFORE body parsers
    fileUpload({
        limits: {
            fileSize: 50 * 1024 * 1024, // 50MB limit
        },
        useTempFiles: true, // Use temporary files
        tempFileDir: os.tmpdir(), // Use OS temp directory (works on Windows and Unix)
        debug: config.node_env === 'dev', // Enable debug in development
        abortOnLimit: true, // Abort upload if file size limit is exceeded
        responseOnLimit: 'File size limit has been reached',
        createParentPath: true, // Create parent path if it doesn't exist
        safeFileNames: true, // Sanitize file names
        preserveExtension: true, // Preserve file extensions
        parseNested: true, // Parse nested objects
        uriDecodeFileNames: true, // Decode file names
    }),
    helmet({
        crossOriginResourcePolicy: false,
    }),
    // Body parsers come after file upload middleware
    express.json(),
    cookieParser(),
    express.urlencoded({ extended: true }),
    customHeader,
    cors({ credentials: true }),
];
export default middleware;