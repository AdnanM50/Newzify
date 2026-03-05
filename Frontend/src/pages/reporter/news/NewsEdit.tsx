import { useNavigate, useParams } from "@tanstack/react-router";
import { Loader2, X } from "lucide-react";
import { useFetch } from "../../../helpers/hooks";
import { 
    getNewsById, 
    getCategories, 
    type TNews, 
    type TCategory, 
    type PaginatedResponse 
} from "../../../helpers/backend";
import NewsForm from "../../../components/admin/news/NewsForm";

const NewsEdit = () => {
  const navigate = useNavigate();
  const { newsId } = useParams({ from: '/reporter-dashboard/news/$newsId/edit' });
  
  const { data: news, isLoading: isNewsLoading, error: newsError } = useFetch<TNews>(
    ["news", newsId],
    () => getNewsById({ id: newsId })
  );

  const { data: categoriesData, isLoading: isCategoriesLoading } = useFetch<PaginatedResponse<TCategory>>(
    "categories", 
    getCategories
  );
  const categories = categoriesData?.docs || [];

  if (isNewsLoading || isCategoriesLoading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-gray-500 animate-pulse font-medium">Loading article details...</p>
      </div>
    );
  }

  if (newsError || !news) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <X size={32} />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Failed to load news</h2>
        <p className="text-gray-500 text-center max-w-md mb-6">
          {newsError?.message || "We couldn't find the article you're looking for or you don't have permission to edit it."}
        </p>
        <button 
          onClick={() => navigate({ to: "/reporter-dashboard/news" })}
          className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
        >
          Back to My News
        </button>
      </div>
    );
  }

  return (
    <div className="p-0 sm:p-2">
      <NewsForm 
        initialData={news}
        categories={categories} 
        onSuccess={() => navigate({ to: "/reporter-dashboard/news" })} 
        onCancel={() => navigate({ to: "/reporter-dashboard/news" })}
      />
    </div>
  );
};

export default NewsEdit;
