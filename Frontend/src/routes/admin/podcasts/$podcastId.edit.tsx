import { createFileRoute } from '@tanstack/react-router'
import PodcastEdit from '../../../pages/admin/podcasts/PodcastEdit'

export const Route = createFileRoute('/admin/podcasts/$podcastId/edit')({
  component: PodcastEdit,
})
