"use client";
import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Menu,
  ExternalLink,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useUser } from "../../context/user";
import toast from "react-hot-toast";

interface ReporterHeaderProps {
  setSidebarOpen: (isOpen: boolean) => void;
}

const ReporterHeader: React.FC<ReporterHeaderProps> = ({ setSidebarOpen }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useUser();

  return (
    <header className="bg-white border-b border-gray-200 z-30 sticky top-0 h-16">
      <div className="flex items-center justify-between px-6 h-full">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-indigo-600 focus:outline-none"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <ExternalLink size={16} />
            Live Site
          </a>

          <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 focus:outline-none group"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <User size={18} />
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 group-hover:text-indigo-900">
                  {user?.name || 'Reporter'}
                </span>
                <ChevronDown size={14} className="text-gray-400 group-hover:text-indigo-600" />
              </div>
            </button>

            {profileOpen && (
                <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)}></div>
                <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20">
                    <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-semibold text-gray-900">{user?.name || 'Reporter'}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role || 'Reporter'}</p>
                    </div>
                    <div className="py-1">
                        <Link
                            to={"/reporter-dashboard/profile" as any}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
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

export default ReporterHeader;
