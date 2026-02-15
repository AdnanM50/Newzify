import { useNavigate } from "@tanstack/react-router";
import { useFetch } from "../../../helpers/hooks";
import { getCategories, type TCategory, type PaginatedResponse } from "../../../helpers/backend";
import NewsForm from "../../../components/admin/news/NewsForm";

const NewsCreate = () => {
  const navigate = useNavigate();
  const { data: categoriesData } = useFetch<PaginatedResponse<TCategory>>("categories", getCategories);
  const categories = categoriesData?.docs || [];

  return (
    <div className="p-6">
      <NewsForm 
        categories={categories} 
        onSuccess={() => navigate({ to: "/admin/news" })} 
        onCancel={() => navigate({ to: "/admin/news" })}
      />
    </div>
  );
};

export default NewsCreate;
