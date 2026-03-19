import React from "react";
import TopstoriesCard from "../Cards/TopstoriesCard";
import ReversTopstoriseCard from "../Cards/reversTopstoriesCard";
import TrandingNewsCard from "../Cards/TrandingnewsCard";
import { useFetch } from "../../helpers/hooks";
import { getPublicNewsList } from "../../helpers/backend";

const TopNews: React.FC = () => {
  const { data: topStoriesResponse, isLoading: isTopLoading } = useFetch(
    ["topStoriesMain"],
    getPublicNewsList,
    { limit: 4, type: 'top' }
  );

  const { data: trendingNewsResponse, isLoading: isTrendingLoading } = useFetch(
    ["trendingNews"],
    getPublicNewsList,
    { limit: 4, type: 'trending' }
  );

  const topStories = topStoriesResponse?.docs || [];
  const trendingNews = trendingNewsResponse?.docs || [];

  return (
    <div className="container mx-auto border-b-2 border-gray-900 py-10">
      <div className="grid grid-cols-1 gap-12 xl:grid-cols-4">
        <div className="xl:col-span-3 col-span-1">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 font-serif">Top stories</h2>
          
          {isTopLoading ? (
            <div className="space-y-8 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-1/3 h-48 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-20 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : topStories.length > 0 ? (
            topStories.map((news: any, index: number) => (
              index % 2 === 0 ? (
                <TopstoriesCard key={news._id} news={news} />
              ) : (
                <ReversTopstoriseCard key={news._id} news={news} />
              )
            ))
          ) : (
            <p className="text-gray-500">No top stories found.</p>
          )}
        </div>
        
        <div className="xl:col-span-1 col-span-1 border-l pl-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 font-serif">
            Trending News
          </h2>
          
          {isTrendingLoading ? (
            <div className="space-y-8 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-full"></div>
                  <div className="h-16 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : trendingNews.length > 0 ? (
            trendingNews.map((news: any) => (
              <TrandingNewsCard key={news._id} news={news} />
            ))
          ) : (
            <p className="text-gray-500">No trending news found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNews;
