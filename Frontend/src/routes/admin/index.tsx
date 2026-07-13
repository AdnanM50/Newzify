import { createFileRoute } from '@tanstack/react-router'
import { Users, FileText, Megaphone, UsersRound, TrendingUp, Newspaper, Heart, MessageCircle } from 'lucide-react'
import { useFetch } from '../../helpers/hooks'
import { fetchUserList, getNewsList, getSubscribersList, getEditorialsList, getPodcastsList, getCommentsList } from '../../helpers/backend'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const { data: usersData, isLoading: loadingUsers } = useFetch('dashboard-users', () => fetchUserList({ role: 'user', limit: 1 }))
  const { data: reportersData, isLoading: loadingReporters } = useFetch('dashboard-reporters', () => fetchUserList({ role: 'reporter', limit: 1 }))
  const { data: newsData, isLoading: loadingNews } = useFetch('dashboard-news', () => getNewsList({ limit: 100 }))
  const { data: subscribersData, isLoading: loadingSubscribers } = useFetch('dashboard-subscribers', () => getSubscribersList({ limit: 1 }))
  const { data: editorialsData, isLoading: loadingEditorials } = useFetch('dashboard-editorials', () => getEditorialsList({ limit: 1 }))
  const { data: podcastsData, isLoading: loadingPodcasts } = useFetch('dashboard-podcasts', () => getPodcastsList({ limit: 1 }))
  const { data: mostLikedNewsData, isLoading: loadingMostLiked } = useFetch('dashboard-most-liked-news', () => getNewsList({ limit: 5, sort: 'likes' }))
  const { data: commentsData, isLoading: loadingComments } = useFetch('dashboard-comments', () => getCommentsList({ limit: 100 }))

  const totalUsers = usersData?.totalDocs || 0
  const totalReporters = reportersData?.totalDocs || 0
  const totalSubscribers = subscribersData?.totalDocs || 0
  const totalNews = newsData?.totalDocs || 0
  const totalEditorials = editorialsData?.totalDocs || 0
  const totalPodcasts = podcastsData?.totalDocs || 0
  const totalContent = totalNews + totalEditorials + totalPodcasts

  const isLoading = loadingUsers || loadingReporters || loadingNews || loadingSubscribers || loadingEditorials || loadingPodcasts

  const newsDocs = newsData?.docs || []
  const publishedNews = newsDocs.filter((n: any) => n.status === 'published').length
  const draftNews = newsDocs.filter((n: any) => n.status === 'draft').length

  const reporterCounts: Record<string, { name: string; count: number; image: string | null }> = {}
  newsDocs.forEach((n: any) => {
    if (n.author) {
      const id = n.author._id
      if (!reporterCounts[id]) {
        reporterCounts[id] = {
          name: `${n.author.first_name} ${n.author.last_name}`,
          count: 0,
          image: n.author.image || null,
        }
      }
      reporterCounts[id].count++
    }
  })
  const topReporters = Object.values(reporterCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const recentNews = newsDocs.slice(0, 5)

  const mostLikedNews = (mostLikedNewsData?.docs || []).slice(0, 5)

  const commentsDocs = commentsData?.docs || []
  const commentCountsByNews: Record<string, { title: string; count: number }> = {}
  commentsDocs.forEach((c: any) => {
    if (c.newsId) {
      const id = typeof c.newsId === 'string' ? c.newsId : c.newsId._id
      const title = typeof c.newsId === 'string' ? 'Unknown' : c.newsId.title
      if (!commentCountsByNews[id]) {
        commentCountsByNews[id] = { title, count: 0 }
      }
      commentCountsByNews[id].count++
    }
  })
  const mostCommentedNews = Object.values(commentCountsByNews)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const mostLikedComments = [...commentsDocs]
    .sort((a: any, b: any) => (b.likes?.length || 0) - (a.likes?.length || 0))
    .slice(0, 5)

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const now = new Date()
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    return { month: monthNames[d.getMonth()], value: 0 }
  })
  newsDocs.forEach((n: any) => {
    const d = new Date(n.createdAt)
    const label = monthNames[d.getMonth()]
    const entry = chartData.find((c) => c.month === label)
    if (entry) entry.value++
  })
  const maxChartValue = Math.max(...chartData.map((d) => d.value), 1)

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      iconBg: '#E8F4FD',
      iconColor: '#7C3AED',
    },
    {
      title: 'Total Reporters',
      value: totalReporters,
      icon: UsersRound,
      iconBg: '#F3E8FF',
      iconColor: '#10B981',
    },
    {
      title: 'Total Content',
      value: totalContent,
      icon: FileText,
      iconBg: '#FEF3C7',
      iconColor: '#F59E0B',
    },
    {
      title: 'Subscribers',
      value: totalSubscribers,
      icon: Megaphone,
      iconBg: '#FFE4E1',
      iconColor: '#FF6B6B',
    },
  ]

  const isLoadingSecondary = loadingMostLiked || loadingComments

  return (
    <div className="admin-dashboard">
      {/* Stats Cards */}
      <div className="admin-stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="admin-stat-card">
              <div className="admin-stat-header">
                <span className="admin-stat-title">{stat.title}</span>
                <div
                  className="admin-stat-icon"
                  style={{ backgroundColor: stat.iconBg }}
                >
                  <Icon size={20} style={{ color: stat.iconColor }} />
                </div>
              </div>
              <div className="admin-stat-value">
                {isLoading ? (
                  <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  stat.value.toLocaleString()
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts and Reporters Section */}
      <div className="admin-charts-section">
        {/* Content Chart */}
        <div className="admin-chart-card">
          <div className="admin-card-header">
            <h3><TrendingUp size={20} /> Content Overview</h3>
          </div>
          {isLoading ? (
            <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
          ) : (
            <>
              <div className="flex gap-4 mb-4 text-sm">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  News: {totalNews} ({publishedNews} published, {draftNews} draft)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                  Editorials: {totalEditorials}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  Podcasts: {totalPodcasts}
                </span>
              </div>
              <div className="admin-chart-container">
                <div className="admin-chart-y-axis">
                  <span>{maxChartValue}</span>
                  <span>{Math.round(maxChartValue * 0.75)}</span>
                  <span>{Math.round(maxChartValue * 0.5)}</span>
                  <span>{Math.round(maxChartValue * 0.25)}</span>
                  <span>0</span>
                </div>
                <div className="admin-chart-area">
                  <svg viewBox="0 0 700 200" className="admin-chart-svg">
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    <path
                      d={`M 0 200 ${chartData.map((d, i) => {
                        const x = (i / (chartData.length - 1)) * 700
                        const y = 200 - (d.value / maxChartValue) * 180
                        return `L ${x} ${y}`
                      }).join(' ')} L 700 200 Z`}
                      fill="url(#chartGradient)"
                    />
                    <path
                      d={`M ${chartData.map((d, i) => {
                        const x = (i / (chartData.length - 1)) * 700
                        const y = 200 - (d.value / maxChartValue) * 180
                        return `${i === 0 ? '' : 'L '}${x} ${y}`
                      }).join(' ')}`}
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="3"
                    />
                    {chartData.map((d, i) => {
                      const x = (i / (chartData.length - 1)) * 700
                      const y = 200 - (d.value / maxChartValue) * 180
                      return (
                        <circle key={i} cx={x} cy={y} r="5" fill="#F59E0B" />
                      )
                    })}
                  </svg>
                  <div className="admin-chart-x-axis">
                    {chartData.map((d) => (
                      <span key={d.month}>{d.month}</span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Top Reporters */}
        <div className="admin-vendors-card">
          <div className="admin-card-header">
            <h3><Users size={20} /> Top Reporters</h3>
            <Link to="/admin/reporters" className="admin-link">View All</Link>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          ) : topReporters.length > 0 ? (
            <div className="admin-vendors-list">
              {topReporters.map((reporter, index) => (
                <div key={index} className="admin-vendor-item">
                  <div className="admin-vendor-rank">#{index + 1}</div>
                  <div className="admin-vendor-avatar overflow-hidden">
                    {reporter.image ? (
                      <img src={reporter.image} alt={reporter.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-sm font-medium">
                        {reporter.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="admin-vendor-info">
                    <span className="admin-vendor-name">{reporter.name}</span>
                    <span className="admin-vendor-orders">{reporter.count} articles</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">No reporters found</div>
          )}
        </div>
      </div>

      {/* Most Liked News & Most Commented News */}
      <div className="admin-charts-section">
        {/* Most Liked News */}
        <div className="admin-chart-card">
          <div className="admin-card-header">
            <h3><Heart size={20} /> Most Liked News</h3>
            <Link to="/admin/news" className="admin-link">View All</Link>
          </div>
          {isLoadingSecondary ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          ) : mostLikedNews.length > 0 ? (
            <div className="admin-vendors-list">
              {mostLikedNews.map((news: any, index: number) => (
                <div key={index} className="admin-vendor-item">
                  <div className="admin-vendor-rank">#{index + 1}</div>
                  <div className="admin-vendor-info">
                    <span className="admin-vendor-name">{news.title}</span>
                    <span className="admin-vendor-orders">{news.category?.name || 'Uncategorized'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium" style={{ color: '#FF6B6B' }}>
                    <Heart size={14} fill="#FF6B6B" />
                    {news.likesCount || 0}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">No news found</div>
          )}
        </div>

        {/* Most Commented News */}
        <div className="admin-vendors-card">
          <div className="admin-card-header">
            <h3><MessageCircle size={20} /> Most Commented News</h3>
            <Link to="/admin/news" className="admin-link">View All</Link>
          </div>
          {isLoadingSecondary ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          ) : mostCommentedNews.length > 0 ? (
            <div className="admin-vendors-list">
              {mostCommentedNews.map((item, index) => (
                <div key={index} className="admin-vendor-item">
                  <div className="admin-vendor-rank">#{index + 1}</div>
                  <div className="admin-vendor-info">
                    <span className="admin-vendor-name">{item.title}</span>
                    <span className="admin-vendor-orders">{item.count} comments</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">No comments found</div>
          )}
        </div>
      </div>

      {/* Most Liked Comments & Recent News */}
      <div className="admin-charts-section">
        {/* Most Liked Comments */}
        <div className="admin-chart-card">
          <div className="admin-card-header">
            <h3><Heart size={20} /> Most Liked Comments</h3>
          </div>
          {isLoadingSecondary ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          ) : mostLikedComments.length > 0 ? (
            <div className="admin-vendors-list">
              {mostLikedComments.map((comment: any, index: number) => (
                <div key={index} className="admin-vendor-item">
                  <div className="admin-vendor-rank">#{index + 1}</div>
                  <div className="admin-vendor-avatar overflow-hidden">
                    {comment.userId?.image ? (
                      <img src={comment.userId.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-sm font-medium">
                        {comment.userId?.first_name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  <div className="admin-vendor-info">
                    <span className="admin-vendor-name line-clamp-1">{comment.content}</span>
                    <span className="admin-vendor-orders">
                      by {comment.userId ? `${comment.userId.first_name} ${comment.userId.last_name}` : 'Unknown'}
                      {comment.newsId?.title ? ` on "${comment.newsId.title}"` : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium" style={{ color: '#10B981' }}>
                    <Heart size={14} fill="#10B981" />
                    {comment.likes?.length || 0}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">No comments found</div>
          )}
        </div>

        {/* Recent News */}
        <div className="admin-vendors-card">
          <div className="admin-card-header">
            <h3><Newspaper size={20} /> Recent News</h3>
            <Link to="/admin/news" className="admin-link">View All</Link>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          ) : recentNews.length > 0 ? (
            <div className="admin-vendors-list">
              {recentNews.map((news: any, index: number) => (
                <div key={index} className="admin-vendor-item">
                  <div className="admin-vendor-rank">#{index + 1}</div>
                  <div className="admin-vendor-info">
                    <span className="admin-vendor-name">{news.title}</span>
                    <span className="admin-vendor-orders">
                      {news.category?.name || 'Uncategorized'} &middot;{' '}
                      <span className={news.status === 'published' ? 'text-emerald-500' : 'text-amber-500'}>
                        {news.status}
                      </span>
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(news.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">No news found</div>
          )}
        </div>
      </div>
    </div>
  )
}
