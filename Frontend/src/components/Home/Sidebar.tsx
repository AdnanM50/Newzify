import React from "react";
import ArticleCard from "./ArticleCard";
import { useFetch } from "../../helpers/hooks";
import { getPublicNewsList } from "../../helpers/backend";

const Sidebar: React.FC = () => {
  const { data: popularNewsResponse, isLoading } = useFetch(
    ["popularNews"],
    getPublicNewsList,
    { limit: 5, type: "popular" }
  );

  const popularArticles = popularNewsResponse?.docs || [];

  return (
    <aside className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular</h2>
        <div className="space-y-6">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          ) : popularArticles.length > 0 ? (
            popularArticles.map((article: any, index: number) => (
              <ArticleCard
                key={article._id || index}
                _id={article._id}
                title={article.title}
                category={article.category?.name || "News"}
                date={article.createdAt ? new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                isExclusive={article.types?.includes('Exclusive') || false}
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm">No popular news found.</p>
          )}
        </div>
      </section>
      
      
    </aside>
  );
};

export default Sidebar;
