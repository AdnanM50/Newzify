import React from "react";
import ArticleCard from "./ArticleCard";
import FeaturedArticle from "./FeaturedArticle";
import Sidebar from "./Sidebar";
import { useFetch } from "../../helpers/hooks";
import { getPublicNewsList } from "../../helpers/backend";
import { Link } from "@tanstack/react-router";

const NewsHerosection: React.FC = () => {
  const threeBoxNews = [
    {
      _id: "dummy-feat-1",
      title: "Social Media Marketing for Franchises is Meant for Women",
      content: "Find people with high expectations and a low tolerance for excuses. They'll have higher expectations for you than you have for yourself. Don't flatter yourself...",
      category: "MARKETING",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      _id: "dummy-feat-2",
      title: "A Look at How Social Media & Mobile Gaming Can Increase Sales",
      category: "FINANCE",
      createdAt: "2021-10-07T10:00:00Z",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      _id: "dummy-feat-3",
      title: "The Secret to Your Company's Financial Health is Very Important",
      category: "FINANCE",
      createdAt: "2021-10-07T10:00:00Z",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  const { data: topArticlesResponse, isLoading: isTopLoading } = useFetch(
    ["topArticles"],
    getPublicNewsList,
    { limit: 4, type: 'top' }
  );

  const fetchedTopArticles = topArticlesResponse?.docs || [];

  const { data: freshStoriesResponse, isLoading: isFreshLoading } = useFetch(
    ["freshStories"],
    getPublicNewsList,
    { limit: 5, type: 'fresh' }
  );

  const fetchedFreshStories = freshStoriesResponse?.docs || [];

  return (
    <div className=" bg-white">
      {/* Top Articles Bar */}
      <div className="bg-gray-50 border-b">
        <div className=" px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {isTopLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))
            ) : fetchedTopArticles.length > 0 ? (
              fetchedTopArticles.map((article: any, index: number) => (
                <div key={article._id || index} className="border-b md:border-b-0 md:border-r last:border-r-0 pb-4 md:pb-0 md:pr-4">
                  <Link 
                    to="/news/$newsId" 
                    params={{ newsId: article._id }}
                    className="text-sm font-bold text-gray-900 leading-tight mb-2 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    {article.title}
                    {article.types?.includes('Exclusive') && (
                      <span className="ml-2 px-2 py-1 bg-red-600 text-white text-xs font-semibold uppercase rounded">
                        EXCLUSIVE
                      </span>
                    )}
                  </Link>
                  <p className="text-xs text-gray-500">
                    {article.createdAt ? new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500">No top news found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Fresh Stories */}
          <div className="col-span-1 pr-4">
            <section className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 font-serif">Fresh stories</h2>
              <p className="text-xs text-gray-500 mb-6 uppercase tracking-wider font-semibold">
                TODAY: BROWSE OUR EDITOR'S HAND PICKED ARTICLES!
              </p>
              
              <div className="space-y-6">
                {isFreshLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="h-20 w-24 bg-gray-200 rounded"></div>
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-2 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : fetchedFreshStories.length > 0 ? (
                  fetchedFreshStories.slice(0, 5).map((story: any, index: number) => (
                    <ArticleCard
                      key={story._id || index}
                      _id={story._id}
                      title={story.title}
                      category={story.category?.name || "News"}
                      date={story.createdAt ? new Date(story.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      isExclusive={story.types?.includes('Exclusive') || false}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No fresh stories found.</p>
                )}
              </div>
              
              <div className="flex space-x-2 mt-8">
                <button className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <span className="text-gray-600 text-sm">←</span>
                </button>
                <button className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <span className="text-gray-600 text-sm">→</span>
                </button>
              </div>
            </section>
          </div>

          {/* Center Column - Featured Article */}
          <div className="lg:col-span-2 grid-cols-1">
            <FeaturedArticle
              title={threeBoxNews[0].title || ""}
              description={threeBoxNews[0].content || ""}
              category={threeBoxNews[0].category || ""}
              imageUrl={threeBoxNews[0].image || ""}
            />
            
            <div className="mt-6 flex flex-col md:flex-row gap-6">
              <ArticleCard
                title={threeBoxNews[1].title}
                category={threeBoxNews[1].category}
                date={threeBoxNews[1].createdAt ? new Date(threeBoxNews[1].createdAt).toLocaleDateString() : 'N/A'}
                imageUrl={threeBoxNews[1].image}
              />
              <ArticleCard
                title={threeBoxNews[2].title}
                category={threeBoxNews[2].category}
                date={threeBoxNews[2].createdAt ? new Date(threeBoxNews[2].createdAt).toLocaleDateString() : 'N/A'}
                imageUrl={threeBoxNews[2].image}
              />
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="col-span-1 pl-4">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsHerosection;