import { createFileRoute } from '@tanstack/react-router'
import NewsCreate from '../../../pages/admin/news/NewsCreate'

export const Route = createFileRoute('/admin/news/create')({
  component: NewsCreate,
})
