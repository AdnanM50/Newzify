import React from "react";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";

interface ReversTopstoriseCardProps {
  news: any;
}

const ReversTopstoriseCard: React.FC<ReversTopstoriseCardProps> = ({ news }) => {
  if (!news) return null;

  return (
    <div className="w-full bg-white flex items-center gap-4 mb-4">
      <div className="w-full">
        <h2 className="text-3xl md:text-5xl font-bold font-serif leading-11 line-clamp-2">
          {news.title}
        </h2>
        <p className="text-gray-900 line-clamp-3 mt-2">{news.content?.replace(/<[^>]*>/g, '') || ""}</p>
        <Link to="/news/$newsId" params={{ newsId: news._id }}>
          <Button className="bg-red-600 cursor-pointer hover:bg-red-700 mt-4 text-white px-6 py-3 font-semibold transition-colors">
            Read More
          </Button>
        </Link>
      </div>
      <div className="w-1/3 h-full">
        <img 
          src={news.image || "https://images.unsplash.com/photo-1585829365234-78d2b67d64b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
          alt={news.title} 
          className="w-full h-48 object-cover" 
        />
      </div>
    </div>
  );
};

export default ReversTopstoriseCard;