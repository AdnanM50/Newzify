import { Router } from 'express';
import { CategoryController } from './category.controller';
import auth from '../../middleware/auth';
import validate from '../../middleware/validate';
import { CategoryValidation } from './category.validation';

const router = Router();

// Admin routes
router.post('/create', auth('admin'), validate(CategoryValidation.createCategorySchema), CategoryController.createCategory);
router.put('/update', auth('admin'), validate(CategoryValidation.updateCategorySchema), CategoryController.updateCategory);
router.delete('/delete', auth('admin'), validate(CategoryValidation.deleteCategorySchema), CategoryController.deleteCategory);

// Authenticated list
router.get('/list', auth('admin', 'reporter'), CategoryController.listCategories);

// Public routes
router.get('/public/list', CategoryController.publicListCategories);
router.get('/public/:slug', CategoryController.getCategoryBySlug);

export const categoryRoutes = router;
