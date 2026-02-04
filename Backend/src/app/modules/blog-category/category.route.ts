import { Router } from 'express';
import { BlogCategoryController } from './category.controller';
import auth from '../../middleware/auth';
import validate from '../../middleware/validate';
import { BlogCategoryValidation } from './category.validation';

const router = Router();

router.post('/create', auth('admin'), validate(BlogCategoryValidation.createCategorySchema), BlogCategoryController.createCategory);
router.put('/update', auth('admin'), validate(BlogCategoryValidation.updateCategorySchema), BlogCategoryController.updateCategory);
router.delete('/delete', auth('admin'), validate(BlogCategoryValidation.deleteCategorySchema), BlogCategoryController.deleteCategory);
router.get('/list', BlogCategoryController.listCategories);
router.get('/:id', BlogCategoryController.getCategory);

export const blogCategoryRoutes = router;
