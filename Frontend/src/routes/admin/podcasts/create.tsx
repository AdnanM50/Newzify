import { createFileRoute } from '@tanstack/react-router'
import PodcastCreate from '../../../pages/admin/podcasts/PodcastCreate'

export const Route = createFileRoute('/admin/podcasts/create')({
  component: PodcastCreate,
})
