import { createFileRoute } from '@tanstack/react-router'
import PodcastsList from '../../../pages/admin/podcasts/PodcastsList'

export const Route = createFileRoute('/admin/podcasts/')({
  component: PodcastsList,
})
