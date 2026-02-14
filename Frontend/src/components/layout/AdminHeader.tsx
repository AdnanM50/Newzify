"use client";
import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Menu,
  ExternalLink,
  User,
  Lock,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useUser } from "../../context/user";
import toast from "react-hot-toast";

interface AdminHeaderProps {
  setSidebarOpen: (isOpen: boolean) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ setSidebarOpen }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  // const [langOpen, setLangOpen] = useState(false);
    const { user, logout } = useUser();
  // Mock data
  // const languages = [
  //   { code: "en", name: "English" },
  //   { code: "es", name: "Spanish" },
  //   { code: "fr", name: "French" },
  // ];


  // const [currentLang, setCurrentLang] = useState(languages[0]);

  return (
    <header className="bg-white border-b border-gray-200 z-30 sticky top-0 h-16">
      <div className="flex items-center justify-between px-6 h-full">
        {/* Left: Mobile Toggle & Title (if needed, but mostly in sidebar) */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-6">
          {/* Live Site Link */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <ExternalLink size={16} />
            Live Site
          </a>

          {/* Language Selector */}
          {/* <div className="relative">
            <button
              onClick={() => {
                setLangOpen(!langOpen);
                
                setProfileOpen(false);
              }}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <Globe size={18} />
              <span className="hidden sm:block">{currentLang.name}</span>
              <ChevronDown size={14} />
            </button>
            {langOpen && (
              <>
                 <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLang(lang);
                        setLangOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        currentLang.code === lang.code
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div> */}


          <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                // setLangOpen(false);
              
              }}
              className="flex items-center gap-3 focus:outline-none group"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <User size={18} />
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {user?.name || 'Admin'}
                </span>
                <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600" />
              </div>
            </button>

            {profileOpen && (
                <>
                 <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)}></div>
              <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20">
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-sm font-semibold text-gray-900">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role || 'User'}</p>
                </div>
                <div className="py-1">
                  <Link
                    to={"/admin/profile" as any}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    <User size={16} />
                    Profile
                  </Link>
                 
                </div>
                <div className="py-1 border-t border-gray-50">
                  <button
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                      window.location.href = '/login';
                      toast.success("Logout successfully");
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
