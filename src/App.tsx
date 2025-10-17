import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import useTheme from './hooks/useTheme';

function App() {
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const backgroundClass = theme === 'dark' 
    ? 'animated-gradient-dark' 
    : 'animated-gradient-light';

  return (
    <div className={`${backgroundClass} min-h-screen text-gray-800 dark:text-gray-200 antialiased`}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
