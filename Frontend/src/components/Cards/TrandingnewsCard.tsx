import React from "react";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";

interface TrandingNewsCardProps {
  news: any;
}

const TrandingNewsCard: React.FC<TrandingNewsCardProps> = ({ news }) => {
  if (!news) return null;

  return (
    <div className="mt-6 group">
      <h3 className="text-lg font-semibold font-serif text-gray-900 leading-tight mb-1 group-hover:text-red-600 transition-colors line-clamp-2">
        {news.title}
      </h3>
      <p className="line-clamp-4 text-gray-600 mt-2">
        {news.content.replace(/<[^>]*>/g, '')}
      </p>
      <Link to="/news/$newsId" params={{ newsId: news._id }}>
        <Button className="bg-red-600 cursor-pointer hover:bg-red-700 mt-4 text-white px-6 py-3 font-semibold transition-colors">
          Read More
        </Button>
      </Link>
    </div>
  );
};

export default TrandingNewsCard;
