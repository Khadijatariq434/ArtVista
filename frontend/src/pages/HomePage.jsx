import React from 'react';
import HeroSection from '../components/HeroSection';
import ArtCategories from '../components/ArtCategories';
import Arts from './Arts';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ArtCategories />
      <Arts/>
    </div>
  );
};

export default HomePage;