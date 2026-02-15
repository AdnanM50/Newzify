import React from 'react';
import { Search, Menu, User, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from '@tanstack/react-router';
import { useFetch } from '../../helpers/hooks';
import { getPublicCategories } from '../../helpers/backend';

interface Props {
  // add your props here
}

const Header: React.FC<Props> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const { data: categoriesData } = useFetch<any>("categories", getPublicCategories, { limit: 100 });
  console.log("🚀 ~ Header ~ categoriesData:", categoriesData)

  const fetchedCategories = (categoriesData as any)?.docs || [];
  
  const categories = fetchedCategories.map((c: any) => ({ _id: c._id, name: c.name, slug: c.slug }));

  const hideForReporter = typeof window !== 'undefined' && window.location.pathname.startsWith('/reporter')
  if (hideForReporter) return null

  // Navigation items logic
  const visibleCategories = categories.slice(0, 8);
  const moreCategories = categories.slice(8);

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Top bar */}
      <div className="bg-gray-800 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <span>Follow us on</span>
          <div className="flex space-x-4">
            <button className="bg-red-600 text-white px-3 py-1 text-xs">Subscribe</button>
            <Link to="/login" className="bg-white text-gray-800 px-3 py-1 text-xs">Login</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-4xl md:text-5xl font-bold text-gray-800 font-serif">NEWZIFY</Link>
          <div className="flex items-center space-x-4">
            <Search className="w-5 h-5 text-gray-600 cursor-pointer" />
            <User className="w-5 h-5 text-gray-600 cursor-pointer" />
            <a href="/dashboard" className="text-sm text-gray-700 hover:text-red-600">User Panel</a>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`bg-gray-50 border-t border-gray-200 ${isMenuOpen ? 'block' : 'hidden'} md:block relative`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-8 py-2">
            {visibleCategories.map((category: any) => (
              <Link
                key={category._id}
                to={`/category/${category.slug || category._id}` as any}
                className="py-2 md:py-3 text-gray-700 hover:text-red-600 transition-colors text-sm font-medium border-b md:border-b-0 border-gray-200"
              >
                {category.name}
              </Link>
            ))}

            {moreCategories.length > 0 && (
              <div 
                className="relative group md:inline-block hidden"
                onMouseEnter={() => setIsMoreOpen(true)}
                onMouseLeave={() => setIsMoreOpen(false)}
              >
                <button
                  className="flex items-center space-x-1 py-2 md:py-3 text-gray-700 hover:text-red-600 transition-colors text-sm font-medium"
                >
                  <span>More</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Mega Menu Dropdown */}
                {isMoreOpen && (
                  <div className="absolute left-0 top-full w-[600px] bg-white shadow-xl border border-gray-100 p-6 z-50 grid grid-cols-3 gap-4 rounded-b-lg">
                    {moreCategories.map((category: any) => (
                      <Link
                        key={category._id}
                        to={`/category/${category.slug || category._id}` as any}
                        className="text-gray-600 hover:text-red-600 text-sm py-1 transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Mobile More categories */}
            {moreCategories.length > 0 && isMenuOpen && (
              <div className="md:hidden">
                <div className="py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">More Categories</div>
                {moreCategories.map((category: any) => (
                  <Link
                    key={category._id}
                    to={`/category/${category.slug || category._id}` as any}
                    className="block py-2 text-gray-700 hover:text-red-600 text-sm font-medium border-b border-gray-100"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
