import React from 'react';
import Hero from '../components/Hero';
import ToolsGrid from '../components/ToolsGrid';
import Courses from '../components/Courses';
import Building from '../components/Building'; // Import Building
import DigitalJourney from '../components/DigitalJourney';

const HomePage = () => {
  return (
    <div className="bg-white min-h-screen selection:bg-black selection:text-white">
      <Hero />
      <ToolsGrid />
      <Courses />
      <Building /> {/* The new Dark Zone */}
      <DigitalJourney />
    </div>
  );
};

export default HomePage;