import { useNavigate } from "@tanstack/react-router";
import { useFetch } from "../../../helpers/hooks";
import {
  getBlogCategories,
  getBlogTags,
  type TBlogCategory,
  type TTag,
  type PaginatedResponse,
} from "../../../helpers/backend";
import BlogForm from "../../../components/admin/blog/BlogForm";

const BlogCreate = () => {
  const navigate = useNavigate();
  const { data: categoriesData } = useFetch<PaginatedResponse<TBlogCategory>>(
    "blog-categories",
    getBlogCategories,
    { limit: 100 }
  );
  const { data: tagsData } = useFetch<PaginatedResponse<TTag>>(
    "blog-tags",
    getBlogTags,
    { limit: 100 }
  );

  const categories = categoriesData?.docs || [];
  const tags = tagsData?.docs || [];

  return (
    <div className="p-0 sm:p-2">
      <BlogForm
        categories={categories}
        tags={tags}
        onSuccess={() => navigate({ to: "/reporter-dashboard" })}
        onCancel={() => navigate({ to: "/reporter-dashboard" })}
      />
    </div>
  );
};

export default BlogCreate;
