import { Router } from 'express';
import { SubscriberController } from './subscriber.controller';
import auth from '../../middleware/auth';

const router = Router();

router.post('/subscribe', SubscriberController.subscribe);
router.post('/unsubscribe', SubscriberController.unsubscribe);
router.get('/list', auth('admin'), SubscriberController.listSubscribers);
router.delete('/delete', auth('admin'), SubscriberController.deleteSubscriber);

export const subscriberRoutes = router;
