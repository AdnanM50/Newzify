import { useNavigate, useParams } from "@tanstack/react-router";
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
  
  const { data: news, isLoading: isNewsLoading } = useFetch<TNews>(
    ["news", newsId],
    () => getNewsById({ id: newsId })
  );

  const { data: categoriesData } = useFetch<PaginatedResponse<TCategory>>(
    "categories", 
    getCategories
  );
  const categories = categoriesData?.docs || [];

  if (isNewsLoading) return <div className="p-6 text-center text-gray-400">Loading...</div>;

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
