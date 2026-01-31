import React from 'react'

interface Props {
  className?: string
}

const UserSidebar: React.FC<Props> = ({ className = '' }) => {
  return (
    <aside className={`w-full md:w-64 bg-white border rounded p-4 ${className}`}>
      <div className="mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-200 mb-3" />
        <div className="font-semibold">You</div>
        <div className="text-sm text-gray-500">Member since 2024</div>
      </div>

      <nav className="space-y-2">
        <a href="#liked" className="block text-gray-700 hover:text-red-600">Liked Posts</a>
        <a href="#comments" className="block text-gray-700 hover:text-red-600">Your Comments</a>
        <a href="#replies" className="block text-gray-700 hover:text-red-600">Replies</a>
        <a href="#settings" className="block text-gray-700 hover:text-red-600">Settings</a>
      </nav>
    </aside>
  )
}

export default UserSidebar
