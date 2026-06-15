import { createFileRoute } from '@tanstack/react-router'
import EditorialEdit from '../../../pages/admin/editorials/EditorialEdit'

export const Route = createFileRoute('/admin/editorials/$editorialId/edit')({
  component: EditorialEdit,
})
