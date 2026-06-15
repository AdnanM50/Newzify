import { createFileRoute } from '@tanstack/react-router'
import EditorialCreate from '../../../pages/admin/editorials/EditorialCreate'

export const Route = createFileRoute('/admin/editorials/create')({
  component: EditorialCreate,
})
