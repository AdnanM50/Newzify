import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
// import employeePermission from '../../middleware/employeePermission';
import { BlogTagValidations } from './blog-tag.validation';
import { BlogTagController } from './blog-tag.controller';

const router = Router();
router.post(
    '/',
    auth('admin', 'employee'),
    // employeePermission('blog_create'),
    validate(BlogTagValidations.postTagValidationSchema),
    BlogTagController.createTags,
);
router.get(
    '/',
    auth('admin', 'employee'),
    // employeePermission('blog_view'),
    BlogTagController.getTagListByAdmin,
);
router.patch(
    '/',
    auth('admin', 'employee'),
    // employeePermission('blog_edit'),
    validate(BlogTagValidations.updateTagValidationSchema),
    BlogTagController.updateTagsByAdmin,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    // employeePermission('blog__delete'),
    BlogTagController.deleteTagsByAdmin,
);
export const tagRoutes: Router = router;
