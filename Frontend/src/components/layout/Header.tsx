import React from 'react';
import { Search, Menu, User } from "lucide-react";
import { useState } from "react";
interface Props {
  // add your props here
}

const Header: React.FC<Props> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hideForReporter = typeof window !== 'undefined' && window.location.pathname.startsWith('/reporter')
  if (hideForReporter) return null
    // Navigation items
  const navItems = ["Politics", "Crime", "Business", "Sports", "Entertainment", "World News", "Technology", "Celebrities"];
  return (
   <header className="bg-white border-b border-gray-200">
      {/* Top bar */}
      <div className="bg-gray-800 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <span>Follow us on</span>
          <div className="flex space-x-4">
            <button className="bg-red-600 text-white px-3 py-1 text-xs">Subscribe</button>
            <button className="bg-white text-gray-800 px-3 py-1 text-xs">Login</button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 font-serif">NEWZIFY</h1>
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
      <nav className={`bg-gray-50 border-t border-gray-200 ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:space-x-8 py-2">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className="py-2 md:py-3 text-gray-700 hover:text-red-600 transition-colors text-sm font-medium border-b md:border-b-0 border-gray-200"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;