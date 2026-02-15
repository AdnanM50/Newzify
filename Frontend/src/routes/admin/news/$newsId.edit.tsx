import { createFileRoute } from '@tanstack/react-router'
import NewsEdit from '../../../pages/admin/news/NewsEdit'

export const Route = createFileRoute('/admin/news/$newsId/edit')({
  component: NewsEdit,
})
