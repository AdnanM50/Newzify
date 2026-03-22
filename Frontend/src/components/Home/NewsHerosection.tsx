import React from "react";
import ArticleCard from "./ArticleCard";
import FeaturedArticle from "./FeaturedArticle";
import Sidebar from "./Sidebar";
import { useFetch } from "../../helpers/hooks";
import { getPublicNewsList, get3BoxGridNews, getMarkPlaceNews } from "../../helpers/backend";
import { Link } from "@tanstack/react-router";
import "../../styles/marquee.css";

const NewsHerosection: React.FC = () => {
  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const { data: threeBoxResponse, isLoading: isThreeBoxLoading } = useFetch(
    ["threeBoxNews"],
    get3BoxGridNews
  );
  
  const threeBoxNews = threeBoxResponse || [];

  const { data: freshStoriesResponse, isLoading: isFreshLoading } = useFetch(
    ["freshStories"],
    getPublicNewsList,
    { limit: 5, type: 'fresh' }
  );

  const fetchedFreshStories = freshStoriesResponse?.docs || [];

  const { data: markPlaceResponse, isLoading: isMarkPlaceLoading } = useFetch(
    ["markPlaceNews"],
    getMarkPlaceNews
  );

  const markPlaceNews = markPlaceResponse || [];

  return (
    <div className=" bg-white">
      {/* Top Articles Bar - Marquee */}
      <div className="bg-gray-50 border-b marquee-container py-3">
        {isMarkPlaceLoading ? (
          <div className="animate-pulse flex px-4">
            <div className="h-4 bg-gray-200 rounded w-1/4 mr-8"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mr-8"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mr-8"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ) : markPlaceNews.length > 0 ? (
          <div className="marquee-content">
            {/* Multiple sets for seamless loop on all screen sizes */}
            {[...markPlaceNews, ...markPlaceNews, ...markPlaceNews, ...markPlaceNews].map((article: any, index: number) => (
              <div key={`${article._id}-${index}`} className="marquee-item border-r border-gray-200">
                <div className="flex flex-col">
                  <Link 
                    to="/news/$newsId" 
                    params={{ newsId: article._id }}
                    className="text-xs font-bold text-gray-900 leading-tight hover:text-red-600 transition-colors cursor-pointer mr-2"
                  >
                    {article.title}
                  </Link>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {article.createdAt ? new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 text-xs text-gray-400 py-1 italic">
            No featured news in Mark Place. Configure in Admin Panel.
          </div>
        )}
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
            {isThreeBoxLoading ? (
              <div className="animate-pulse space-y-6">
                <div className="h-96 bg-gray-200 rounded-xl"></div>
                <div className="flex gap-6">
                  <div className="h-48 flex-1 bg-gray-200 rounded-lg"></div>
                  <div className="h-48 flex-1 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            ) : threeBoxNews.length > 0 ? (
              <>
                <FeaturedArticle
                  _id={threeBoxNews[0]?._id}
                  title={threeBoxNews[0]?.title || ""}
                  description={stripHtml(threeBoxNews[0]?.content || "").substring(0, 160) + "..."}
                  category={typeof threeBoxNews[0]?.category === 'object' ? (threeBoxNews[0]?.category as any)?.name : (threeBoxNews[0]?.category || "Featured")}
                  imageUrl={threeBoxNews[0]?.image || ""}
                />
                
                <div className="mt-6 flex flex-col md:flex-row gap-6">
                  {threeBoxNews[1] && (
                    <ArticleCard
                      _id={threeBoxNews[1]?._id}
                      title={threeBoxNews[1]?.title}
                      category={typeof threeBoxNews[1]?.category === 'object' ? (threeBoxNews[1]?.category as any)?.name : (threeBoxNews[1]?.category || "News")}
                      date={threeBoxNews[1]?.createdAt ? new Date(threeBoxNews[1].createdAt).toLocaleDateString() : 'N/A'}
                      imageUrl={threeBoxNews[1]?.image}
                    />
                  )}
                  {threeBoxNews[2] && (
                    <ArticleCard
                      _id={threeBoxNews[2]?._id}
                      title={threeBoxNews[2]?.title}
                      category={typeof threeBoxNews[2]?.category === 'object' ? (threeBoxNews[2]?.category as any)?.name : (threeBoxNews[2]?.category || "News")}
                      date={threeBoxNews[2]?.createdAt ? new Date(threeBoxNews[2].createdAt).toLocaleDateString() : 'N/A'}
                      imageUrl={threeBoxNews[2]?.image}
                    />
                  )}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center text-gray-400">
                <div>
                  <div className="text-4xl mb-4 text-gray-200">📰</div>
                  <p className="font-medium">No featured articles selected for this section yet.</p>
                  <p className="text-sm">Configure this in the Admin Panel {'>'} Page Settings</p>
                </div>
              </div>
            )}
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