import { useNavigate, useParams } from "@tanstack/react-router";
import { useFetch } from "../../../helpers/hooks";
import { getCategories, getNewsById, type TCategory, type TNews, type PaginatedResponse } from "../../../helpers/backend";
import NewsForm from "../../../components/admin/news/NewsForm";
import { Loader2 } from "lucide-react";

const NewsEdit = () => {
  const navigate = useNavigate();
  const { newsId } = useParams({ from: '/admin/news/$newsId/edit' });
  
  const { data: news, isLoading: isNewsLoading } = useFetch<TNews>(
    ["news", newsId],
    getNewsById,
    { id: newsId }
  );

  const { data: categoriesData } = useFetch<PaginatedResponse<TCategory>>("categories", getCategories);
  const categories = categoriesData?.docs || [];

  if (isNewsLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <NewsForm 
        initialData={news}
        categories={categories} 
        onSuccess={() => navigate({ to: "/admin/news" })} 
        onCancel={() => navigate({ to: "/admin/news" })}
      />
    </div>
  );
};

export default NewsEdit;
