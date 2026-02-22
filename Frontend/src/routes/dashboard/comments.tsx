import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { UserCommentsSection } from '@/components/user/UserCommentsSection'
import { userProfileApi } from '@/helpers/api'

export const Route = createFileRoute('/dashboard/comments')({
  component: CommentsPage,
})

function CommentsPage() {
  const [comments, setComments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchComments = async () => {
    setIsLoading(true)
    try {
      const response: any = await userProfileApi.getUserComments({ page: 1, limit: 20 })
      setComments(response.data?.docs || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
      setComments([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [])

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Your Comments</h1>
        <p className="text-gray-600 mt-1">Comments you've made on news articles</p>
      </div>
      <UserCommentsSection comments={comments} isLoading={isLoading} />
    </div>
  )
}
