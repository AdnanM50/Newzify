import morgan from 'morgan';
import config from './../config';
import compression from 'compression';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';

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
    fileUpload({
        limits: {
            fileSize: 50 * 1024 * 1024,
        },
    }),
    helmet({
        crossOriginResourcePolicy: false,
    }),
    express.json(),
    cookieParser(),
    express.urlencoded({ extended: true }),
    customHeader,
    cors({ credentials: true }),
];
export default middleware;