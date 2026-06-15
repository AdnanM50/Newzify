import { createFileRoute } from '@tanstack/react-router'
import PodcastDetails from '../../pages/PodcastDetails'

export const Route = createFileRoute('/podcasts/$podcastId')({
  component: PodcastDetails,
})
