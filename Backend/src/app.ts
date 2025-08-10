import express, { Request, Response } from 'express';
import middleware from './app/middleware';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFoundHandler from './app/middleware/notFoundHandler';
// import path from 'node:path';
import router from "./app/routes";

const app = express();

// Add debugging for middleware
console.log('Setting up middleware...');

// Remove this line - it's already in the middleware array
// app.use(express.json());

console.log('Applying custom middleware...');
app.use(middleware);

// eslint-disable-next-line no-undef
// app.use('/public', express.static(path.join(__dirname, './../public')));

console.log('Setting up routes...');
app.use('/api/v1', router);

app.get('/', (_req: Request, res: Response): void => {
    res.status(200).json({
        success: true,
        message: "You're Welcome to Newzify API",
    });
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response): void => {
    res.status(200).json({
        success: true,
        message: "Server is healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.use(globalErrorHandler);
app.use(notFoundHandler);

export { app };