import { createFileRoute } from '@tanstack/react-router'
import NewsCreate from '../../../pages/reporter/news/NewsCreate'

export const Route = createFileRoute('/reporter-dashboard/news/create')({
  component: NewsCreate,
})
