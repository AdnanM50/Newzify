import { createFileRoute } from '@tanstack/react-router'
import EditorialEdit from '../../../pages/reporter/editorials/EditorialEdit'

export const Route = createFileRoute('/reporter-dashboard/editorials/$editorialId/edit')({
  component: EditorialEdit,
})
