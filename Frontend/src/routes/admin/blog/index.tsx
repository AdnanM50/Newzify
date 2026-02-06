import { createFileRoute } from '@tanstack/react-router'
import BlogManagement from '../../../pages/admin/blog'

export const Route = createFileRoute('/admin/blog/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <BlogManagement />
}
