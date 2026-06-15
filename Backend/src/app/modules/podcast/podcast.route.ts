import { Router } from 'express';
import { PodcastController } from './podcast.controller';
import auth from '../../middleware/auth';
import validate from '../../middleware/validate';
import { PodcastValidation } from './podcast.validation';

const router = Router();

// Create podcast - accessible by authenticated users (admin and reporter)
router.post('/create', auth(), validate(PodcastValidation.createPodcastSchema), PodcastController.createPodcast);
// Update podcast - admin and reporter can update
router.put('/update', auth(), validate(PodcastValidation.updatePodcastSchema), PodcastController.updatePodcast);
// Delete podcast - admin can delete any, reporter can delete own
router.delete('/delete', auth(), validate(PodcastValidation.deletePodcastSchema), PodcastController.deletePodcast);

// Authenticated list/get (admin/reporter)
router.get('/list', auth(''), PodcastController.listPodcasts);
router.get('/:id', auth(), PodcastController.getPodcast);

// Public endpoints
router.get('/public/list', PodcastController.publicList);
router.get('/public/:id', PodcastController.publicGet);

export const podcastRoutes = router;
