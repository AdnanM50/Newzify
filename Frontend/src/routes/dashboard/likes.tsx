import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { LikedPostsSection } from '@/components/user/LikedPostsSection'
import { userProfileApi } from '@/helpers/api'

export const Route = createFileRoute('/dashboard/likes')({
  component: LikesPage,
})

function LikesPage() {
  const [likedPosts, setLikedPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchLikedPosts = async () => {
    setIsLoading(true)
    try {
      const response: any = await userProfileApi.getLikedPosts({ page: 1, limit: 20 })
      setLikedPosts(response.data?.docs || [])
    } catch (error) {
      console.error('Error fetching liked posts:', error)
      setLikedPosts([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLikedPosts()
  }, [])

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Liked Posts</h1>
        <p className="text-gray-600 mt-1">Posts you've liked recently</p>
      </div>
      <LikedPostsSection posts={likedPosts} isLoading={isLoading} />
    </div>
  )
}
