import React, { useEffect, useState } from 'react'
import UserSidebar from '../components/layout/UserSidebar'

type Post = {
  id: string
  title: string
  excerpt?: string
}

type Comment = {
  id: string
  postId: string
  text: string
  replies?: Comment[]
}

const LikedPosts: React.FC<{ items: Post[] }> = ({ items }) => {
  if (!items.length) return <div>No liked posts yet.</div>
  return (
    <div className="space-y-4">
      {items.map(p => (
        <div key={p.id} className="p-4 border rounded bg-white">
          <div className="font-semibold">{p.title}</div>
          {p.excerpt && <div className="text-sm text-gray-600">{p.excerpt}</div>}
        </div>
      ))}
    </div>
  )
}

const UserComments: React.FC<{ items: Comment[] }> = ({ items }) => {
  if (!items.length) return <div>No comments yet.</div>
  return (
    <div className="space-y-4">
      {items.map(c => (
        <div key={c.id} className="p-4 border rounded bg-white">
          <div className="text-sm text-gray-700">{c.text}</div>
          <div className="mt-2 pl-2 border-l">
            {c.replies && c.replies.length ? (
              c.replies.map(r => (
                <div key={r.id} className="text-sm text-gray-600 py-1">↳ {r.text}</div>
              ))
            ) : (
              <div className="text-xs text-gray-400">No replies</div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

const UserDashboard: React.FC = () => {
  const [liked, setLiked] = useState<Post[]>([])
  const [comments, setComments] = useState<Comment[]>([])

  useEffect(() => {
    // For now read from localStorage as a simple mock. Replace with real API calls.
    try {
      const likedRaw = localStorage.getItem('likedPosts') || '[]'
      const commentsRaw = localStorage.getItem('userComments') || '[]'
      setLiked(JSON.parse(likedRaw))
      setComments(JSON.parse(commentsRaw))
    } catch (e) {
      setLiked([])
      setComments([])
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:space-x-6">
        <UserSidebar />

        <main className="flex-1 space-y-6 mt-6 md:mt-0">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">User Panel</h2>
            <div className="text-sm text-gray-500">Welcome back</div>
          </div>

          <section id="liked" className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold mb-3">Liked Posts</h3>
            <LikedPosts items={liked} />
          </section>

          <section id="comments" className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold mb-3">Your Comments</h3>
            <UserComments items={comments} />
          </section>

          <section id="replies" className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold mb-3">All Replies</h3>
            {/* Flatten replies */}
            {comments.flatMap(c => c.replies || []).length ? (
              comments.flatMap(c => c.replies || []).map(r => (
                <div key={r.id} className="p-3 border rounded bg-white mb-2">{r.text}</div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No replies found</div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

export default UserDashboard
