import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  FileText,
  CheckCircle2,
  FileEdit,
  Clock,
  Plus,
  Eye,
  Edit,
  Loader2,
  Image as ImageIcon,
  BookOpen,
  Radio,
  ArrowRight,
} from "lucide-react";
import { useFetch } from "../../helpers/hooks";
import {
  getNewsList,
  getEditorialsList,
  getPodcastsList,
  type TNews,
  type TEditorial,
  type TPodcast,
  type PaginatedResponse,
} from "../../helpers/backend";
import NewsPreviewModal from "../../components/admin/news/NewsPreviewModal";

const Dashboard = () => {
  const [selectedNews, setSelectedNews] = useState<TNews | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Fetch reporter's news
  const { data: newsData, isLoading: isNewsLoading } = useFetch<PaginatedResponse<TNews>>(
    "news",
    getNewsList,
    { limit: 1000 }
  );

  // Fetch reporter's editorials
  const { data: editorialsData, isLoading: isEditorialsLoading } = useFetch<PaginatedResponse<TEditorial>>(
    "editorials",
    getEditorialsList,
    { limit: 100 }
  );

  // Fetch reporter's podcasts
  const { data: podcastsData, isLoading: isPodcastsLoading } = useFetch<PaginatedResponse<TPodcast>>(
    "podcasts",
    getPodcastsList,
    { limit: 100 }
  );

  const newsList = newsData?.docs || [];
  const totalNews = newsData?.totalDocs ?? newsList.length;
  const publishedNews = newsList.filter((item) => item.status === "published").length;
  const draftNews = newsList.filter((item) => item.status === "draft").length;
  const pendingNews = newsList.filter((item) => (item as any).status === "pending").length;

  const totalEditorials = editorialsData?.totalDocs ?? editorialsData?.docs?.length ?? 0;
  const totalPodcasts = podcastsData?.totalDocs ?? podcastsData?.docs?.length ?? 0;

  const recentNews = newsList.slice(0, 5);

  const openPreview = (news: TNews) => {
    setSelectedNews(news);
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Create Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Reporter Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Overview of your published news articles, drafts, and multimedia content.
          </p>
        </div>
        <Link
          to="/reporter-dashboard/news/create"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          Create News
        </Link>
      </div>

      {/* Main 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total News */}
        <Link
          to="/reporter-dashboard/news"
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all group block"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Total News</p>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText size={20} />
            </div>
          </div>
          <div className="mt-2">
            {isNewsLoading ? (
              <div className="flex items-center gap-2 py-1 text-gray-400">
                <Loader2 className="animate-spin" size={24} />
              </div>
            ) : (
              <p className="text-3xl font-bold text-indigo-600">{totalNews}</p>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">All articles created</p>
        </Link>

        {/* Published */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Published</p>
            <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="mt-2">
            {isNewsLoading ? (
              <div className="flex items-center gap-2 py-1 text-gray-400">
                <Loader2 className="animate-spin text-green-600" size={24} />
              </div>
            ) : (
              <p className="text-3xl font-bold text-green-600">{publishedNews}</p>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">Live on Newzify</p>
        </div>

        {/* Drafts */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Drafts</p>
            <div className="w-10 h-10 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center">
              <FileEdit size={20} />
            </div>
          </div>
          <div className="mt-2">
            {isNewsLoading ? (
              <div className="flex items-center gap-2 py-1 text-gray-400">
                <Loader2 className="animate-spin text-yellow-600" size={24} />
              </div>
            ) : (
              <p className="text-3xl font-bold text-yellow-600">{draftNews}</p>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">Unpublished drafts</p>
        </div>

        {/* Pending */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Pending</p>
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-2">
            {isNewsLoading ? (
              <div className="flex items-center gap-2 py-1 text-gray-400">
                <Loader2 className="animate-spin text-orange-600" size={24} />
              </div>
            ) : (
              <p className="text-3xl font-bold text-orange-600">{pendingNews}</p>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">Awaiting review</p>
        </div>
      </div>

      {/* Secondary Quick Stats / Links for Editorials and Podcasts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/reporter-dashboard/editorials"
          className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:border-purple-200 hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen size={22} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">My Editorials</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                {isEditorialsLoading ? (
                  <Loader2 className="animate-spin text-purple-600" size={18} />
                ) : (
                  <span className="text-2xl font-bold text-gray-900">{totalEditorials}</span>
                )}
                <span className="text-xs text-gray-400">articles written</span>
              </div>
            </div>
          </div>
          <span className="text-xs font-semibold text-purple-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
            View All <ArrowRight size={14} />
          </span>
        </Link>

        <Link
          to="/reporter-dashboard/podcasts"
          className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:border-rose-200 hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Radio size={22} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">My Podcasts</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                {isPodcastsLoading ? (
                  <Loader2 className="animate-spin text-rose-600" size={18} />
                ) : (
                  <span className="text-2xl font-bold text-gray-900">{totalPodcasts}</span>
                )}
                <span className="text-xs text-gray-400">episodes created</span>
              </div>
            </div>
          </div>
          <span className="text-xs font-semibold text-rose-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
            View All <ArrowRight size={14} />
          </span>
        </Link>
      </div>

      {/* Recent News Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">Recent News Articles</h2>
            <p className="text-xs text-gray-500 mt-0.5">Your most recently updated stories</p>
          </div>
          <Link
            to="/reporter-dashboard/news"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            View all ({totalNews}) <ArrowRight size={14} />
          </Link>
        </div>

        {isNewsLoading ? (
          <div className="p-12 flex justify-center text-gray-400">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : recentNews.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Image</th>
                  <th className="px-6 py-3.5 font-semibold">Title</th>
                  <th className="px-6 py-3.5 font-semibold">Status</th>
                  <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentNews.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-100 flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-6 h-6 m-3 text-gray-300" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="font-medium text-gray-900 max-w-sm truncate" title={item.title}>
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${
                          item.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex justify-end gap-1 items-center">
                        <button
                          onClick={() => openPreview(item)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Preview"
                        >
                          <Eye size={18} />
                        </button>
                        <Link
                          to={"/reporter-dashboard/news/$newsId/edit" as any}
                          params={{ newsId: item._id } as any}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <ImageIcon size={28} className="text-indigo-300" />
            </div>
            <p className="text-base font-medium text-gray-700">No news articles yet</p>
            <p className="text-xs text-gray-400 mt-1 mb-4">Start by publishing your first article to see stats here.</p>
            <Link
              to="/reporter-dashboard/news/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus size={16} /> Create News
            </Link>
          </div>
        )}
      </div>

      <NewsPreviewModal
        news={selectedNews}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
