import { Router } from 'express';
import { PageSettingControllers } from './page-setting.controller';

const router = Router();

router.put('/', PageSettingControllers.updatePageSettings);
router.get('/', PageSettingControllers.getPageSettings);

export const pageSettingRoutes = router;
