import React from "react";
import CategoryBadge from "./CategoryBadge";

interface ArticleCardProps {
  title: string;
  category: string;
  date: string;
  isExclusive?: boolean;
  imageUrl?: string;
  className?: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ title, category, date, isExclusive, imageUrl, className }: ArticleCardProps) => {
  return (
    <article className={`group cursor-pointer ${className}`}>
      {imageUrl && (
        <div className="relative mb-3 overflow-hidden rounded-lg">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <CategoryBadge 
              category={category} 
              variant={isExclusive ? "exclusive" : "default"}
            />
          </div>
        </div>
      )}
      
      {!imageUrl && (
        <div className="mb-2">
          <CategoryBadge 
            category={category} 
            variant={isExclusive ? "exclusive" : "default"}
          />
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-1 group-hover:text-red-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-500">{date}</p>
    </article>
  );
};

export default ArticleCard;
