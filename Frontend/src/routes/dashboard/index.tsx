import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useDashboard } from '../dashboard'
import { userProfileApi } from '@/helpers/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Heart, 
  MessageSquare, 
  Reply, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  Sparkles,
  BookOpen,
  Compass,
  ExternalLink
} from 'lucide-react'

export const Route = createFileRoute('/dashboard/')({
  component: UserDashboardOverview,
})

interface DashboardSummaryData {
  stats: {
    totalLikes: number;
    totalComments: number;
    totalReplies: number;
  };
  recentLikes: Array<{
    _id: string;
    title: string;
    slug: string;
    image?: string;
    content?: string;
    category?: { name: string; slug: string };
    author?: { first_name: string; last_name: string; image?: string };
    createdAt: string;
    likes?: string[];
  }>;
  recentComments: Array<{
    _id: string;
    content: string;
    createdAt: string;
    likes?: string[];
    newsId?: {
      _id: string;
      title: string;
      slug: string;
      image?: string;
    };
  }>;
  recommendedStories: Array<{
    _id: string;
    title: string;
    slug: string;
    image?: string;
    category?: { name: string; slug: string };
    author?: { first_name: string; last_name: string; image?: string };
    createdAt: string;
    types?: string[];
  }>;
}

function UserDashboardOverview() {
  const { userProfile } = useDashboard()
  const [data, setData] = useState<DashboardSummaryData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchSummary = async () => {
    setIsLoading(true)
    try {
      const response: any = await userProfileApi.getDashboardSummary()
      if (response?.success && response?.data) {
        setData(response.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard summary:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [])

  const stats = data?.stats || {
    totalLikes: 0,
    totalComments: 0,
    totalReplies: 0,
  }

  const displayName = userProfile?.first_name 
    ? `${userProfile.first_name} ${userProfile.last_name || ''}`.trim()
    : 'Reader'

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-red-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-xs px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-red-400" /> Reader Dashboard
            </span>
            <span className="text-gray-400 text-xs">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Welcome back, {displayName}!
          </h1>
          <p className="text-gray-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
            Stay informed with the latest insights. Track your liked stories, community discussions, and curated news in one place.
          </p>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap gap-2 mt-5">
            <Link
              to="/tranding-news"
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-lg backdrop-blur-sm transition-all flex items-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5 text-red-400" /> Trending News
            </Link>
            <Link
              to="/fresh-stories"
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-lg backdrop-blur-sm transition-all flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-blue-400" /> Fresh Stories
            </Link>
            <Link
              to="/dashboard/settings"
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-lg backdrop-blur-sm transition-all flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Account Settings
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Liked Articles */}
        <Link to="/dashboard/likes" className="group">
          <Card className="hover:border-red-200 hover:shadow-md transition-all duration-200 h-full border-gray-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">Liked Articles</CardTitle>
              <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="w-5 h-5 fill-red-100 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16 mb-1" />
              ) : (
                <div className="text-3xl font-bold text-gray-900 tracking-tight">{stats.totalLikes}</div>
              )}
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>Stories you've saved & loved</span>
                <span className="text-red-600 font-medium group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                  View <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Comments */}
        <Link to="/dashboard/comments" className="group">
          <Card className="hover:border-blue-200 hover:shadow-md transition-all duration-200 h-full border-gray-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">Your Comments</CardTitle>
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16 mb-1" />
              ) : (
                <div className="text-3xl font-bold text-gray-900 tracking-tight">{stats.totalComments}</div>
              )}
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>Discussions you joined</span>
                <span className="text-blue-600 font-medium group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                  View <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Replies */}
        <Link to="/dashboard/replies" className="group">
          <Card className="hover:border-amber-200 hover:shadow-md transition-all duration-200 h-full border-gray-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">Discussion Replies</CardTitle>
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Reply className="w-5 h-5 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16 mb-1" />
              ) : (
                <div className="text-3xl font-bold text-gray-900 tracking-tight">{stats.totalReplies}</div>
              )}
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>Replies to your comments</span>
                <span className="text-amber-600 font-medium group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                  View <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* 2-Column: Recent Liked Articles & Recent Comments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Liked Articles */}
        <Card className="border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <CardHeader className="pb-3 border-b border-gray-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-serif font-bold text-gray-900 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-600" /> Recently Liked Stories
                </CardTitle>
                <CardDescription className="text-xs text-gray-500 mt-0.5">
                  Your most recently saved and favorited news articles
                </CardDescription>
              </div>
              <Link
                to="/dashboard/likes"
                className="text-xs font-medium text-red-600 hover:text-red-700 flex items-center gap-0.5"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <Skeleton className="w-16 h-14 rounded-lg flex-shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : data?.recentLikes && data.recentLikes.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {data.recentLikes.map((post) => (
                    <Link
                      key={post._id}
                      to="/news/$newsId"
                      params={{ newsId: post._id }}
                      className="py-3 first:pt-0 last:pb-0 flex items-center gap-3.5 group hover:bg-gray-50/80 -mx-2 px-2 rounded-lg transition-colors"
                    >
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-16 h-14 rounded-lg object-cover flex-shrink-0 group-hover:brightness-95 transition-all"
                        />
                      ) : (
                        <div className="w-16 h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-400">
                          <BookOpen className="w-6 h-6" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        {post.category && (
                          <span className="text-[10px] font-semibold tracking-wider text-red-600 uppercase">
                            {post.category.name}
                          </span>
                        )}
                        <h4 className="text-sm font-semibold text-gray-800 line-clamp-1 group-hover:text-red-600 transition-colors">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-red-500 font-medium">
                            <Heart className="w-3 h-3 fill-current" />
                            {post.likes?.length || 1}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 px-4">
                  <div className="w-12 h-12 rounded-full bg-red-50 text-red-400 flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">No liked articles yet</p>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                    When you read stories you enjoy, tap the heart icon to save them here for quick access.
                  </p>
                  <Link
                    to="/tranding-news"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 mt-3"
                  >
                    Browse Trending News <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </CardContent>
          </div>
        </Card>

        {/* Recent Comments */}
        <Card className="border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <CardHeader className="pb-3 border-b border-gray-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-serif font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" /> Recent Discussion Comments
                </CardTitle>
                <CardDescription className="text-xs text-gray-500 mt-0.5">
                  Your thoughts and opinions shared across news articles
                </CardDescription>
              </div>
              <Link
                to="/dashboard/comments"
                className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-3 border border-gray-100 rounded-lg space-y-2">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  ))}
                </div>
              ) : data?.recentComments && data.recentComments.length > 0 ? (
                <div className="space-y-3">
                  {data.recentComments.map((comment) => (
                    <div
                      key={comment._id}
                      className="p-3 border border-gray-100 bg-gray-50/50 rounded-lg hover:border-gray-200 transition-colors"
                    >
                      {comment.newsId ? (
                        <Link
                          to="/news/$newsId"
                          params={{ newsId: comment.newsId._id }}
                          className="text-xs font-semibold text-gray-800 hover:text-red-600 line-clamp-1 flex items-center gap-1 mb-1.5"
                        >
                          <span className="text-gray-400 font-normal">On:</span> {comment.newsId.title}
                          <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        </Link>
                      ) : (
                        <span className="text-xs text-gray-400 italic block mb-1">Article no longer available</span>
                      )}
                      <p className="text-xs text-gray-600 line-clamp-2 italic">
                        "{comment.content}"
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2 pt-1 border-t border-gray-100">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                        {comment.likes && comment.likes.length > 0 && (
                          <span className="text-red-500 font-medium flex items-center gap-0.5">
                            <Heart className="w-3 h-3 fill-current" /> {comment.likes.length}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 px-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-400 flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">No comments posted yet</p>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                    Join the conversation! Leave your perspectives on published news stories to engage with other readers.
                  </p>
                  <Link
                    to="/top-stories"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 mt-3"
                  >
                    Explore Top Stories <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Recommended / Trending Stories Grid */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <CardTitle className="text-lg font-serif font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-600" /> Recommended For You
            </CardTitle>
            <CardDescription className="text-xs text-gray-500 mt-0.5">
              Top trending stories and breaking updates right now on Newzify
            </CardDescription>
          </div>
          <Link
            to="/tranding-news"
            className="text-xs font-medium text-red-600 hover:text-red-700 flex items-center gap-0.5"
          >
            Explore all stories <ArrowRight className="w-3 h-3" />
          </Link>
        </CardHeader>
        <CardContent className="pt-5">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-32 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : data?.recommendedStories && data.recommendedStories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {data.recommendedStories.map((story) => (
                <Link
                  key={story._id}
                  to="/news/$newsId"
                  params={{ newsId: story._id }}
                  className="group flex flex-col h-full bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                    {story.image ? (
                      <img
                        src={story.image}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                        <BookOpen className="w-8 h-8" />
                      </div>
                    )}
                    {story.category && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-black/75 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 font-medium border-none">
                          {story.category.name}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-3.5 flex flex-col flex-1 justify-between">
                    <h3 className="font-serif font-bold text-sm text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                      {story.title}
                    </h3>
                    <div className="flex items-center justify-between text-[11px] text-gray-400 mt-3 pt-2 border-t border-gray-50">
                      <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                      {story.author && (
                        <span className="font-medium text-gray-600 truncate max-w-[100px]">
                          By {story.author.first_name}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No stories available at this time.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
