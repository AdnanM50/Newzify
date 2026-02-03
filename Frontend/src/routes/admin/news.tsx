import { createFileRoute } from '@tanstack/react-router'
import News from '../../pages/admin/news'

export const Route = createFileRoute('/admin/news')({
  component: RouteComponent,
})

function RouteComponent() {
  return <News />
}
