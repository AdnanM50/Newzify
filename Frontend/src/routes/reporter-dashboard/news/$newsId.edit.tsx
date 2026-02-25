import { createFileRoute } from '@tanstack/react-router'
import NewsEdit from '../../../pages/reporter/news/NewsEdit'

export const Route = createFileRoute('/reporter-dashboard/news/$newsId/edit')({
  component: NewsEdit,
})
