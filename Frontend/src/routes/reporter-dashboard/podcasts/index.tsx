import { createFileRoute } from '@tanstack/react-router'
import PodcastsList from '../../../pages/reporter/podcasts/PodcastsList'

export const Route = createFileRoute('/reporter-dashboard/podcasts/')({
  component: PodcastsList,
})
