import express, { Request, Response } from 'express';
import middleware from './app/middleware';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFoundHandler from './app/middleware/notFoundHandler';
// import path from 'node:path';
import router from "./app/routes";

const app = express();

app.use(express.json());

app.use(middleware);
// eslint-disable-next-line no-undef
// app.use('/public', express.static(path.join(__dirname, './../public')));
app.use('/api/v1', router);
app.get('/', (_req: Request, res: Response): void => {
    res.status(200).json({
        success: true,
        message: "You're Welcome to Shopstick Pro API",
    });
});

app.use(globalErrorHandler);
app.use(notFoundHandler);

export { app };