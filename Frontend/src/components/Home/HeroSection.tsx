import { useState, useEffect } from 'react';
import { useFetch } from '../../helpers/hooks';
import { getPageSettings } from '../../helpers/backend';
import { Link } from '@tanstack/react-router';

const HeroSection: React.FC = () => {
  const { data: pageSettingsRaw } = useFetch<any>("page-settings", getPageSettings);
  const heroNews = pageSettingsRaw?.data?.heroNews || [];

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
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1495020689067-958852a7765e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80')"
          }}
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
          backgroundImage: `url('${currentNews.image || "https://images.unsplash.com/photo-1495020689067-958852a7765e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"}')`
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col justify-center min-h-[300px]">
        <div className="max-w-3xl transform transition-all duration-500 translate-y-0 opacity-100">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-serif leading-tight line-clamp-3">
            {currentNews.title}
          </h2>
          <div 
            className="text-lg md:text-xl mb-8 text-gray-200 line-clamp-2 max-w-2xl"
            dangerouslySetInnerHTML={{ __html: (currentNews.content || '').substring(0, 150) + "..." }}
          />
          <Link 
            to="/news/$newsId" 
            params={{ newsId: currentNews.slug || currentNews._id }} 
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 font-bold uppercase tracking-wider text-sm transition-colors rounded shadow-lg"
          >
            Read More
          </Link>
        </div>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-4 flex space-x-2">
          {heroNews.map((_: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-red-600 w-8' : 'bg-white/50 hover:bg-white w-2'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
