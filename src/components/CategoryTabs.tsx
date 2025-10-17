import React from 'react';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="px-4 pb-3">
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
        {categories.map(category => (
            <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                activeCategory === category
                ? 'bg-white text-gray-900 shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            >
            {category}
            </button>
        ))}
        </div>
    </div>
  );
};

export default CategoryTabs;
