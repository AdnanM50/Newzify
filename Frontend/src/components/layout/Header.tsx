import React, { useState } from 'react';
import { Search, Menu, ChevronDown } from "lucide-react";
import { Link, useNavigate } from '@tanstack/react-router';
import { useFetch } from '../../helpers/hooks';
import { getPublicCategories, getPageSettings } from '../../helpers/backend';
import { getUserRole, decodeToken } from '../../helpers/auth';
import { useUser } from '../../context/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DEFAULT_SOCIAL_LINKS, getSocialIcon, type SocialLink } from '../../helpers/social';
import SubscribeModal from '../SubscribeModal';
import SearchModal from '../common/SearchModal';
import toast from 'react-hot-toast';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { user, logout } = useUser();
  const navigate = useNavigate();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const decoded = token ? decodeToken(token) : null;
  const role = user?.role || decoded?.role || getUserRole();
  const isLoggedIn = Boolean(token && role);

  const displayName = user?.first_name || decoded?.first_name || user?.name || '';
  const firstAlphabet = (displayName.trim()?.[0] || user?.email?.[0] || decoded?.email?.[0] || 'U').toUpperCase();
  const userImage = user?.image || user?.avatar;

  const dashboardPath = 
    role === 'admin' 
      ? '/admin' 
      : role === 'reporter' 
        ? '/reporter-dashboard' 
        : '/dashboard';

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate({ to: '/' });
  };

  const { data: categoriesData } = useFetch<any>("categories", getPublicCategories, { limit: 100 });
  const { data: pageSettings } = useFetch<any>("page-settings", getPageSettings);

  const socialLinks: SocialLink[] = 
    pageSettings?.socialLinks && pageSettings.socialLinks.length > 0 
      ? pageSettings.socialLinks 
      : DEFAULT_SOCIAL_LINKS;

  const fetchedCategories = (categoriesData as any)?.docs || [];
  
  const categories = fetchedCategories.map((c: any) => ({ _id: c._id, name: c.name, slug: c.slug }));

  const hideForReporter = typeof window !== 'undefined' && window.location.pathname.startsWith('/reporter')
  if (hideForReporter) return null

  const visibleCategories = categories.slice(0, 8);
  const moreCategories = categories.slice(8);

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        {/* Top bar */}
        <div className="bg-gray-800 text-white py-2">
          <div className="container mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center space-x-2.5">
              <span className="text-gray-300 text-xs sm:text-sm font-medium">Follow us on</span>
              <div className="flex items-center space-x-1 sm:space-x-1.5">
                {socialLinks.map((s, idx) => (
                  <a
                    key={idx}
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.name}
                    className="w-6 h-6 rounded-full bg-gray-700/80 hover:bg-red-600 text-gray-300 hover:text-white flex items-center justify-center transition-all hover:scale-110"
                  >
                    {getSocialIcon(s.name, "w-3.5 h-3.5")}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsSubscribeOpen(true)}
                className="bg-red-600 text-white px-3 py-1 text-xs hover:bg-red-700 transition-colors cursor-pointer"
              >
                Subscribe
              </button>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-white text-gray-800 px-3 py-1 text-xs hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" className="bg-white text-gray-800 px-3 py-1 text-xs">Login</Link>
              )}
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-4xl md:text-5xl font-bold text-gray-800 font-serif">NEWZIFY</Link>
            <div className="flex items-center space-x-4">
              <Search className="w-5 h-5 text-gray-600 cursor-pointer" onClick={() => setIsSearchOpen(true)} />
              {isLoggedIn ? (
                <Link
                  to={dashboardPath as any}
                  title={displayName ? `${displayName}'s Dashboard (${role})` : 'Dashboard'}
                  className="flex items-center justify-center transition-transform hover:scale-105 focus:outline-none"
                >
                  <Avatar className="w-9 h-9 rounded-full border border-gray-200 shadow-sm cursor-pointer hover:ring-2 hover:ring-red-600 transition-all">
                    {userImage ? (
                      <AvatarImage src={userImage} alt={displayName || 'User Avatar'} className="object-cover" />
                    ) : null}
                    <AvatarFallback className="bg-red-600 text-white font-bold text-sm select-none">
                      {firstAlphabet}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              ) : null}
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
              {isLoggedIn && (
                <Link
                  to={dashboardPath as any}
                  className="py-2 md:py-3 text-gray-700 hover:text-red-600 transition-colors text-sm font-medium border-b md:border-b-0 border-gray-200"
                  activeProps={{
                    className: 'text-red-600 font-semibold',
                  }}
                >
                  Dashboard
                </Link>
              )}
              <Link
                to="/tranding-news"
                className="py-2 md:py-3 text-gray-700 hover:text-red-600 transition-colors text-sm font-medium border-b md:border-b-0 border-gray-200"
              >
                Trending
              </Link>
              <Link
                to="/top-stories"
                className="py-2 md:py-3 text-gray-700 hover:text-red-600 transition-colors text-sm font-medium border-b md:border-b-0 border-gray-200"
              >
                Top Stories
              </Link>
              <Link
                to="/popular"
                className="py-2 md:py-3 text-gray-700 hover:text-red-600 transition-colors text-sm font-medium border-b md:border-b-0 border-gray-200"
              >
                Popular
              </Link>
              <Link
                to="/fresh-stories"
                className="py-2 md:py-3 text-gray-700 hover:text-red-600 transition-colors text-sm font-medium border-b md:border-b-0 border-gray-200"
              >
                Fresh Stories
              </Link>
              <div className="h-6 w-px bg-gray-200 hidden md:block mx-1"></div>
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

      <SubscribeModal isOpen={isSubscribeOpen} onClose={() => setIsSubscribeOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;
