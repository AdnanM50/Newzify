import React from 'react';
import HeroSection from "../components/Home/HeroSection"
import NewsHerosection from '../components/Home/NewsHerosection';
import TopNews from '../components/Home/Topnews';
import NewsSection from '../components/Home/NewsBlogingsection';

const Home: React.FC = () => {


  return (
    <>
     <HeroSection />
     <NewsHerosection />
     <TopNews />
     <NewsSection/>
    </>
  )
}

export default Home;
