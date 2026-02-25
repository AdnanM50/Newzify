import { createFileRoute } from '@tanstack/react-router'
import NewsList from '../../../pages/reporter/news/NewsList'

export const Route = createFileRoute('/reporter-dashboard/news/')({
  component: NewsList,
})
