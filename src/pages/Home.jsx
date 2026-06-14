import React from 'react';
import BootDashboard from '../components/Modules/BootDashboard';

const Home = ({ onBootComplete }) => {
  return <BootDashboard onBootComplete={onBootComplete} />;
};

export default Home;
