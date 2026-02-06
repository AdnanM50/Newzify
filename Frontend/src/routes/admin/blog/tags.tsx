import { createFileRoute } from '@tanstack/react-router'
import BlogTags from '../../../pages/admin/blog/tags'

export const Route = createFileRoute('/admin/blog/tags')({
  component: RouteComponent,
})

function RouteComponent() {
  return <BlogTags />
}
