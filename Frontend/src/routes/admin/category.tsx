import { createFileRoute } from '@tanstack/react-router'
import Category from '../../pages/admin/category'

export const Route = createFileRoute('/admin/category')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Category />
}
