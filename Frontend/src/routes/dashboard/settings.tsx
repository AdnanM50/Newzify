import { createFileRoute } from '@tanstack/react-router'
import { useDashboard } from '../dashboard'
import { SettingsForm } from '@/components/user/SettingsForm'

export const Route = createFileRoute('/dashboard/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { userProfile, fetchUserProfile } = useDashboard()

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-1">Update your profile information</p>
      </div>
      <SettingsForm user={userProfile} onUpdate={fetchUserProfile} />
    </div>
  )
}
