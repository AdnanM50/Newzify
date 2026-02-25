"use client";
import React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  User,
  Menu,
} from "lucide-react";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/reporter-dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: "My News",
    href: "/reporter-dashboard/news",
    icon: <FileText size={20} />,
  },
  {
    label: "Create News",
    href: "/reporter-dashboard/news/create",
    icon: <PlusCircle size={20} />,
  },
  {
    label: "Profile",
    href: "/reporter-dashboard/profile",
    icon: <User size={20} />,
  },
];

interface ReporterSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const ReporterSidebar: React.FC<ReporterSidebarProps> = ({ isOpen, setIsOpen }) => {
  const currentPath = useLocation().pathname;

  const isActive = (href: string) => {
    // Find the closest matching menu item (the one with the longest href that matches the current path)
    const matchingItems = menuItems
      .filter(item => currentPath.startsWith(item.href))
      .sort((a, b) => b.href.length - a.href.length);
      
    const bestMatch = matchingItems[0];
    return bestMatch?.href === href;
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-indigo-900 shadow-xl transition-transform duration-300 transform w-64 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static flex flex-col border-r border-indigo-800`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-indigo-800">
          <Link to="/reporter-dashboard" className="text-xl font-bold text-white font-serif tracking-tight">REPORTER</Link>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-indigo-300 hover:text-white focus:outline-none"
          >
            <Menu size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1 p-3">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                    to={item.href as any}
                    className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-all rounded-lg gap-3 mb-1 ${
                    isActive(item.href)
                        ? "bg-white text-indigo-900 shadow-lg"
                        : "text-indigo-100 hover:bg-indigo-800 hover:text-white"
                    }`}
                >
                    {item.icon}
                    {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default ReporterSidebar;
