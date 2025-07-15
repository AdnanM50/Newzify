import React from "react";
import CategoryBadge from "./CategoryBadge";

interface FeaturedArticleProps {
  title: string;
  description: string;
  category: string;
  imageUrl: string;
}

const FeaturedArticle: React.FC<FeaturedArticleProps> = ({ title, description, category, imageUrl }: FeaturedArticleProps) => {
  return (
    <article className="relative overflow-hidden rounded-xl group cursor-pointer">
      <div className="absolute inset-0">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      </div>
      
      <div className="relative z-10 p-8 h-full min-h-[400px] flex flex-col justify-end">
        <div className="mb-4">
          <CategoryBadge category={category} />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 group-hover:text-red-100 transition-colors">
          {title}
        </h1>
        
        <p className="text-lg text-gray-200 leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>
    </article>
  );
};

export default FeaturedArticle;
