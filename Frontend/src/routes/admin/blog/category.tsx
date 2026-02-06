import { createFileRoute } from '@tanstack/react-router'
import BlogCategory from '../../../pages/admin/blog/category'

export const Route = createFileRoute('/admin/blog/category')({
  component: RouteComponent,
})

function RouteComponent() {
  return <BlogCategory />
}
