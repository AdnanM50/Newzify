import { Router } from 'express';
import { BlogController } from './blog.controller';
import auth from '../../middleware/auth';
import validate from '../../middleware/validate';
import { BlogValidation } from './blog.validation';

const router = Router();

router.post('/create', auth('admin'), validate(BlogValidation.createBlogSchema), BlogController.createBlog);
router.put('/update', auth('admin'), validate(BlogValidation.updateBlogSchema), BlogController.updateBlog);
router.delete('/delete', auth('admin'), validate(BlogValidation.deleteBlogSchema), BlogController.deleteBlog);
router.get('/list', BlogController.listBlogs);
router.get('/:id', BlogController.getBlog);

export const blogRoutes = router;
