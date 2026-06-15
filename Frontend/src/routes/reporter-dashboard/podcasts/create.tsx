import { createFileRoute } from '@tanstack/react-router'
import PodcastCreate from '../../../pages/reporter/podcasts/PodcastCreate'

export const Route = createFileRoute('/reporter-dashboard/podcasts/create')({
  component: PodcastCreate,
})
