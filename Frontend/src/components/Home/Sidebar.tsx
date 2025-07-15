import React from "react";
import ArticleCard from "./ArticleCard";

const Sidebar: React.FC = () => {
  const popularArticles = [
    {
      title: "Social Media Marketing for Franchises is Meant for Women",
      category: "MARKETING",
      date: "September 29, 2021"
    },
    {
      title: "A Look at How Social Media & Mobile Gaming Can Increase Sales",
      category: "FINANCE",
      date: "September 29, 2021"
    },
    {
      title: "Cover Girl Announces Star Shine Makeup Line is Due for Next December",
      category: "MAKE-UP",
      date: "September 29, 2021"
    },
    {
      title: "Customer Engagement: New Strategy for the Economy",
      category: "MARKETING",
      date: "September 29, 2021",
      isExclusive: true
    },
    {
      title: "10 Outfits Inspired by Famous Art are Sold in London",
      category: "MAKE-UP",
      date: "September 29, 2021",
      isExclusive: true
    }
  ];

  return (
    <aside className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular</h2>
        <div className="space-y-6">
          {popularArticles.map((article, index) => (
            <ArticleCard
              key={index}
              title={article.title}
              category={article.category}
              date={article.date}
              isExclusive={article.isExclusive}
            />
          ))}
        </div>
      </section>
      
      
    </aside>
  );
};

export default Sidebar;
