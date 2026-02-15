import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useFetch, useDelete } from "../../../helpers/hooks";
import {
  getNewsList,
  deleteNews,
  type TNews,
  type PaginatedResponse,
} from "../../../helpers/backend";
import { Trash, Edit, Loader2, Image as ImageIcon, Eye, MessageSquare, Plus } from "lucide-react";
import NewsPreviewModal from "../../../components/admin/news/NewsPreviewModal";

const NewsList = () => {
  const [selectedNews, setSelectedNews] = useState<TNews | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { data: newsData, isLoading: isNewsLoading, refetch: refetchNews } = useFetch<PaginatedResponse<TNews>>(
    "news",
    getNewsList
  );
  const newsList = newsData?.docs || [];

  const { mutate: remove } = useDelete(deleteNews, {
    onSuccess: () => refetchNews(),
    successMessage: "News deleted successfully",
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this news?")) {
      remove({ body: { _id: id } });
    }
  };

  const openPreview = (news: TNews) => {
    setSelectedNews(news);
    setIsPreviewOpen(true);
  };

  return (
    <div className="p-6" id="admin-news-list">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">News Management</h1>
           <p className="text-gray-500">View and manage all news articles published on Newzify.</p>
        </div>
        <Link 
          to="/admin/news/create"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
        >
          <Plus size={20} />
          Add News
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isNewsLoading ? (
          <div className="p-12 flex justify-center text-gray-400">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : newsList.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Image</th>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {newsList.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-100">
                          {item.image ? (
                              <img src={item.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                              <ImageIcon className="w-6 h-6 m-3 text-gray-300" />
                          )}
                      </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 max-w-xs truncate" title={item.title}>
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {typeof item.category === 'object' && item.category !== null ? (item.category as any).name : '-'}
                      </span>
                  </td>
                  <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {item.status}
                      </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 items-center">
                      <button 
                        onClick={() => openPreview(item)} 
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Preview"
                      >
                        <Eye size={18} />
                      </button>
                      <Link 
                        to="/admin/news/$newsId/comments"
                        params={{ newsId: item._id }}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                        title="Comments"
                      >
                        <MessageSquare size={18} />
                      </Link>
                      <Link 
                        to="/admin/news/$newsId/edit"
                        params={{ newsId: item._id }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(item._id)} 
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-20 text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <ImageIcon size={32} className="text-gray-300" />
            </div>
            <p className="text-lg font-medium text-gray-600">No news found</p>
            <p className="text-sm text-gray-400 mt-1">Start by creating your first article.</p>
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

export default NewsList;
