import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
// import employeePermission from '../../middleware/employeePermission';
import { BlogValidations } from './blog.validation';
import { BlogController } from './blog.controller';

const router = Router();
router.post(
    '/',
    auth('admin', 'employee'),
    // employeePermission('blog_create'),
    validate(BlogValidations.postBlogValidationSchema),
    BlogController.createBlogs,
);
router.get(
    '/',
    auth('admin', 'employee'),
    // employeePermission('blog_view'),
    BlogController.getBlogListByAdmin,
);
router.get('/site', BlogController.getBlogListByPublic);
router.get('/categories', BlogController.getBlogCategoryListByPublic);
router.patch(
    '/',
    auth('admin', 'employee'),
    // employeePermission('blog_edit'),
    validate(BlogValidations.updateBlogValidationSchema),
    BlogController.updateBlogByAdmin,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    // employeePermission('blog_delete'),
    BlogController.deleteBlogByAdmin,
);
export const blogRoutes: Router = router;
