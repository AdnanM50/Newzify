import { createFileRoute } from '@tanstack/react-router'
import NewsList from '../../../pages/admin/news/NewsList'

export const Route = createFileRoute('/admin/news/')({
  component: NewsList,
})
