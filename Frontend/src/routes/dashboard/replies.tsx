import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { RepliesSection } from '@/components/user/RepliesSection'
import { userProfileApi } from '@/helpers/api'

export const Route = createFileRoute('/dashboard/replies')({
  component: RepliesPage,
})

function RepliesPage() {
  const [replies, setReplies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchReplies = async () => {
    setIsLoading(true)
    try {
      const response: any = await userProfileApi.getUserReplies({ page: 1, limit: 20 })
      setReplies(response.data?.docs || [])
    } catch (error) {
      console.error('Error fetching replies:', error)
      setReplies([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReplies()
  }, [])

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Your Replies</h1>
        <p className="text-gray-600 mt-1">Replies you've made to other comments</p>
      </div>
      <RepliesSection replies={replies} isLoading={isLoading} />
    </div>
  )
}
