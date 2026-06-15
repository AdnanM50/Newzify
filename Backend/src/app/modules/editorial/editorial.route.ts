import { Router } from 'express';
import { EditorialController } from './editorial.controller';
import auth from '../../middleware/auth';
import validate from '../../middleware/validate';
import { EditorialValidation } from './editorial.validation';

const router = Router();

// Create editorial - accessible by authenticated users (admin and reporter)
router.post('/create', auth(), validate(EditorialValidation.createEditorialSchema), EditorialController.createEditorial);
// Update editorial - admin and reporter can update
router.put('/update', auth(), validate(EditorialValidation.updateEditorialSchema), EditorialController.updateEditorial);
// Delete editorial - admin can delete any, reporter can delete own
router.delete('/delete', auth(), validate(EditorialValidation.deleteEditorialSchema), EditorialController.deleteEditorial);

// Authenticated list/get (admin/reporter)
router.get('/list', auth(''), EditorialController.listEditorials);
router.get('/:id', auth(), EditorialController.getEditorial);

// Public endpoints
router.get('/public/list', EditorialController.publicList);
router.get('/public/:id', EditorialController.publicGet);

export const editorialRoutes = router;
