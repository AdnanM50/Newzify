import { createFileRoute } from '@tanstack/react-router'
import NewsDetails from '../../pages/NewsDetails'

export const Route = createFileRoute('/news/$newsId')({
  component: NewsDetails,
})
