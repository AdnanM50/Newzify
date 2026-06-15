import { createFileRoute } from '@tanstack/react-router'
import EditorialsList from '../../../pages/admin/editorials/EditorialsList'

export const Route = createFileRoute('/admin/editorials/')({
  component: EditorialsList,
})
