import { createFileRoute } from '@tanstack/react-router'
import PodcastEdit from '../../../pages/reporter/podcasts/PodcastEdit'

export const Route = createFileRoute('/reporter-dashboard/podcasts/$podcastId/edit')({
  component: PodcastEdit,
})
