import React from "react";
import ArticleCard from "./ArticleCard";
import FeaturedArticle from "./FeaturedArticle";
import Sidebar from "./Sidebar";



 const topArticles = [
    {
      title: "A Look at How Social Media & Mobile Gaming Can Increase Sales",
      date: "October 7, 2021"
    },
    {
      title: "The Secret to Your Company's Financial Health is Very Important",
      date: "October 7, 2021"
    },
    {
      title: "Things to Look For in a Financial Trading Platform Environment",
      date: "October 7, 2021",
      isExclusive: true
    },
    {
      title: "The Politics Behind Morocco's Stock Market Turbulence Last Year",
      date: "October 7, 2021"
    }
  ];

  const freshStories = [
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
      title: "Social Media Marketing for Franchises is Meant for Women",
      category: "MARKETING",
      date: "September 29, 2021"
    },
    {
      title: "Entrepreneurial Advertising: The Future Of Marketing",
      category: "MARKETING",
      date: "September 29, 2021"
    },
    {
      title: "Mobile Marketing is Said to Be the Future of E-Commerce",
      category: "MARKETING",
      date: "September 29, 2021"
    }
  ];
const NewsHerosection: React.FC = () => {
  return (
    <div className="container bg-white">
      {/* Top Articles Bar */}
      <div className="bg-gray-50 border-b">
        <div className=" px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topArticles.map((article, index) => (
              <div key={index} className="border-b md:border-b-0 md:border-r last:border-r-0 pb-4 md:pb-0 md:pr-4">
                <h3 className="text-sm font-bold text-gray-900 leading-tight mb-2 hover:text-red-600 transition-colors cursor-pointer">
                  {article.title}
                  {article.isExclusive && (
                    <span className="ml-2 px-2 py-1 bg-red-600 text-white text-xs font-semibold uppercase rounded">
                      EXCLUSIVE
                    </span>
                  )}
                </h3>
                <p className="text-xs text-gray-500">{article.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Fresh Stories */}
          <div className="col-span-1">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Fresh stories</h2>
              <p className="text-sm text-gray-600 mb-6 uppercase tracking-wide">
                TODAY: BROWSE OUR EDITOR'S HAND PICKED ARTICLES!
              </p>
              
              <div className="space-y-6">
                {freshStories.map((story, index) => (
                  <ArticleCard
                    key={index}
                    title={story.title}
                    category={story.category}
                    date={story.date}
                    isExclusive={story.isExclusive}
                  />
                ))}
              </div>
              
              <div className="flex space-x-4 mt-8">
                <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                  <span className="text-gray-600">←</span>
                </button>
                <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                  <span className="text-gray-600">→</span>
                </button>
              </div>
            </section>
          </div>

          {/* Center Column - Featured Article */}
          <div className="lg:col-span-2 grid-cols-1">
            <FeaturedArticle
              title="Social Media Marketing for Franchises is Meant for Women"
              description="Find people with high expectations and a low tolerance for excuses. They'll have higher expectations for you than you have for yourself. Don't flatter yourself..."
              category="MARKETING"
              imageUrl="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
            />
            
            <div className="mt-3 flex gap-4">
              <ArticleCard
                title="A Look at How Social Media & Mobile Gaming Can Increase Sales"
                category="FINANCE"
                date="FINANCE"
                imageUrl="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              />
              
              <ArticleCard
                title="The Secret to Your Company's Financial Health is Very Important"
                category="FINANCE"
                date="FINANCE"
                imageUrl="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              />
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="col-span-1">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsHerosection;