import { useState, useEffect } from 'react';
import { useFetch } from '../../helpers/hooks';
import { getHeroCarouselNews } from '../../helpers/backend';
import { Link } from '@tanstack/react-router';

const HeroSection: React.FC = () => {
  const { data: heroNewsResponse, isLoading } = useFetch(
    ["heroCarousel"],
    getHeroCarouselNews
  );
  const heroNews = heroNewsResponse || [];

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (heroNews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroNews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroNews.length]);

  if (heroNews.length === 0) {
    // Fallback to original static content if no settings are configured
    return (
      <section className="bg-gray-900 text-white py-8 md:py-16 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
         
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-serif leading-tight">
              Israel's aggression in Gaza continues
            </h2>
            <p className="text-lg md:text-xl mb-6 text-gray-300">
              Latest developments in the ongoing conflict as international pressure mounts
            </p>
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 font-semibold transition-colors">
              Read More
            </button>
          </div>
        </div>
      </section>
    );
  }

  const currentNews = heroNews[currentIndex];

  return (
    <section className="bg-gray-900 text-white py-8 md:py-16 relative overflow-hidden transition-all duration-500 min-h-[400px]">
      <div 
        key={currentNews._id}
        className="absolute inset-0 bg-cover bg-center opacity-40 transition-opacity duration-1000 ease-in-out"
        style={{
          backgroundImage: `url('${currentNews.image}')`
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col justify-center min-h-[300px]">
        {isLoading ? (
          <div className="max-w-3xl animate-pulse">
            <div className="h-12 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="h-10 bg-gray-700 rounded w-32"></div>
          </div>
        ) : (
          <div className="max-w-3xl transform transition-all duration-500 translate-y-0 opacity-100">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-serif leading-tight line-clamp-3">
              {currentNews.title}
            </h2>
            <p className="text-lg md:text-xl mb-8 text-gray-200 line-clamp-2 max-w-2xl">
              {stripHtml(currentNews.content || '').substring(0, 150) + "..."}
            </p>
            <Link 
              to="/news/$newsId" 
              params={{ newsId: currentNews._id }} 
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 font-bold uppercase tracking-wider text-sm transition-colors rounded shadow-lg"
            >
              Read More
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
