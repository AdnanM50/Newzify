import { Router } from 'express';
import { NewsController } from './news.controller';
import auth from '../../middleware/auth';
import validate from '../../middleware/validate';
import { NewsValidation } from './news.validation';

const router = Router();

// Create news - accessible by authenticated users (admin and reporter)
router.post('/create', auth(), validate(NewsValidation.createNewsSchema), NewsController.createNews);
// Update news - admin and reporter can update types (admin can set multiple)
router.put('/update', auth(), validate(NewsValidation.updateNewsSchema), NewsController.updateNews);
// Delete news - admin can delete any, reporter can delete own
router.delete('/delete', auth(), validate(NewsValidation.deleteNewsSchema), NewsController.deleteNews);

// Authenticated list/get (admin/reporter)
router.get('/list', auth(''), NewsController.listNews);
router.get('/:id', auth(), NewsController.getNews);

// Public endpoints
router.get('/public/list', NewsController.publicList);
router.get('/public/:id', NewsController.publicGet);

export const newsRoutes = router;
