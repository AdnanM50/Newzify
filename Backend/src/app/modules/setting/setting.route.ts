import { Router } from 'express';
import { SettingControllers } from './setting.controller';
import validate from '../../middleware/validate';
import { SettingValidations } from './setting.validation';
import auth from '../../middleware/auth';
// import employeePermission from '../../middleware/employeePermission';

const router = Router();

router.post(
    '/',
    auth('admin', 'reporter'),
    // employeePermission('setting_create'),
    validate(SettingValidations.postSettingValidationSchema),
    SettingControllers.postSiteSettings,
);

router.get(
    '/',
    auth('admin', 'reporter'),
    // employeePermission('setting_view'),
    SettingControllers.getSettings,
);
router.get(
    '/env-checks',
    SettingControllers.checkSettingEnv,
);
router.post(
    '/env-creates',
    SettingControllers.postSettingEnvBYAdmin,
);

router.get('/site', SettingControllers.getSiteSettings);

export const settingRoutes: Router = router;
