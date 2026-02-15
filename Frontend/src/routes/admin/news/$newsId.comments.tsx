import { createFileRoute } from '@tanstack/react-router'
import NewsCommentsPage from '../../../pages/admin/news/NewsCommentsPage'

export const Route = createFileRoute('/admin/news/$newsId/comments')({
  component: NewsCommentsPage,
})
