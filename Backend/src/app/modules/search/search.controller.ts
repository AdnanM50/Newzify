import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import SearchService from './search.service';

export class SearchController {
    static search = catchAsync(async (req: Request, res: Response) => {
        const { q, limit } = req.query;

        const query = (q as string) || '';
        const resultLimit = parseInt(limit as string) || 10;

        const results = await SearchService.search(query, resultLimit);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Search results retrieved successfully',
            data: results,
        });
    });
}
