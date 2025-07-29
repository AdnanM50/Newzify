import React from "react";
import TopstoriesCard from "../Cards/TopstoriesCard";
import ReversTopstoriseCard from "../Cards/reversTopstoriesCard";
import TrandingNewsCard from "../Cards/TrandingnewsCard";

const TopNews: React.FC = () => {
  return (
    <div className="container mx-auto border-b-2 border-gray-900">
      <div className="grid grid-cols-1  gap-5 xl:grid-cols-4 ">
        <div className="xl:col-span-3 col-span-1">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Top stories</h2>
          <TopstoriesCard />
          <ReversTopstoriseCard />
          <TopstoriesCard />
          <ReversTopstoriseCard />
        </div>
        <div className="xl:col-span-1 col-span-1">
          <h2 className="text-3xl font-bold text-end text-gray-900 mb-5">
            Tranding News
          </h2>
          <TrandingNewsCard />
          <TrandingNewsCard />
          <TrandingNewsCard />
          <TrandingNewsCard />
        </div>
      </div>
      
    </div>
  );
};

export default TopNews;
