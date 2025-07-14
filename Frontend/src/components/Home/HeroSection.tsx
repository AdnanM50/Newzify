import React from 'react';



const HeroSection: React.FC = () => {
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
};

export default HeroSection;
