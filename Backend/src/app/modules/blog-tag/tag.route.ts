import { Router } from 'express';
import { TagController } from './tag.controller';
import auth from '../../middleware/auth';
import validate from '../../middleware/validate';
import { TagValidation } from './tag.validation';

const router = Router();

router.post('/create', auth(), validate(TagValidation.createTagSchema), TagController.createTag);
router.put('/update', auth(), validate(TagValidation.updateTagSchema), TagController.updateTag);
router.delete('/delete', auth(), validate(TagValidation.deleteTagSchema), TagController.deleteTag);
router.get('/list', TagController.listTags);
router.get('/:id', TagController.getTag);

export const tagRoutes = router;
