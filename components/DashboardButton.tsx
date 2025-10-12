import React from 'react';
import { Link } from 'react-router-dom';

const DashboardButton: React.FC = () => {
  return (
    <Link 
      to="/dashboard"
      className="fixed bottom-8 left-8 z-30 bg-white/20 dark:bg-black/30 backdrop-blur-lg w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg transform transition-transform duration-300 hover:scale-110 active:scale-95"
      aria-label="View saved quotes"
    >
      📚
    </Link>
  );
};

export default DashboardButton;