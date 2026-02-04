"use client";
import React, { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  UsersRound,
  Layers,
  Tags,
  FileText,
  Mail,
  Settings,
  Languages,
  HelpCircle,
  Layout,
  ChevronDown,
  ChevronRight,
  Menu,
} from "lucide-react";

interface MenuItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: "News",
    href: "/admin/news",
    icon: <Users size={20} />,
  },
  {
    label: "Category",
    href: "/admin/category",
    icon: <CreditCard size={20} />,
  },
  {
    label: "Group",
    href: "/admin/group",
    icon: <UsersRound size={20} />,
  },
  {
    label: "Blog",
    icon: <FileText size={20} />,
    children: [
      {
        label: "Category",
        href: "/admin/blog/category",
        icon: <Layers size={18} />,
      },
      {
        label: "Tags",
        href: "/admin/blog/tags",
        icon: <Tags size={18} />,
      },
      {
        label: "Blogs",
        href: "/admin/blog",
        icon: <FileText size={18} />,
      },
    ],
  },

  {
    label: "Settings",
    icon: <Settings size={20} />,
    children: [
      {
        label: "Settings",
        href: "/admin/settings",
        icon: <Settings size={18} />,
      },
      {
        label: "Languages",
        href: "/admin/languages",
        icon: <Languages size={18} />,
      },
      {
        label: "Email Settings",
        href: "/admin/email-setting",
        icon: <Mail size={18} />,
      },
      {
        label: "Faq",
        href: "/admin/faq",
        icon: <HelpCircle size={18} />,
      },
      {
        label: "Page Settings",
        href: "/admin/page-settings",
        icon: <Layout size={18} />,
      },
    ],
  },
];

interface AdminSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, setIsOpen }) => {
  const currentPath = useLocation().pathname;
  // Initialize openSections based on whether a child is active
    const [openSections, setOpenSections] = useState<string[]>(() => {
        const initialOpen: string[] = [];
        menuItems.forEach((item) => {
            if (item.children) {
                const hasActiveChild = item.children.some(child => child.href === currentPath);
                if (hasActiveChild) {
                    initialOpen.push(item.label);
                }
            }
        });
        return initialOpen;
    });


  const toggleSection = (label: string) => {
    setOpenSections((prev) =>
      prev.includes(label)
        ? prev.filter((l) => l !== label)
        : [...prev, label]
    );
  };

  const isActive = (href?: string) => {
      if (!href) return false;
      if (href === '/admin') return currentPath === '/admin';
      return currentPath.startsWith(href);
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
        className={`fixed top-0 left-0 z-50 h-screen bg-gray-800 shadow-xl transition-transform duration-300 transform w-64 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static flex flex-col border-r border-gray-700`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
          <span className="text-xl font-bold text-white">NEWZIFY</span>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white focus:outline-none"
          >
            <Menu size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1 p-3">
            {menuItems.map((item, index) => (
              <li key={index}>
                {item.children ? (
                  <div className="flex flex-col">
                    <button
                      onClick={() => toggleSection(item.label)}
                      className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium transition-colors rounded-lg mb-1 ${
                         openSections.includes(item.label) ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {openSections.includes(item.label) ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        openSections.includes(item.label)
                          ? "max-h-screen opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <ul className="pl-4 space-y-1 border-l-2 border-gray-700 ml-4">
                        {item.children.map((child, childIndex) => (
                          <li key={childIndex}>
                            <Link
                              to={child.href as any}
                              className={`flex items-center w-full px-4 py-2 text-sm transition-colors rounded-lg gap-3 ${
                                isActive(child.href)
                                  ? "text-gray-800 font-medium bg-white"
                                  : "text-gray-400 hover:text-white hover:bg-gray-700"
                              }`}
                            >
                                {child.icon}
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.href as any}
                    className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors rounded-lg gap-3 mb-1 ${
                      isActive(item.href)
                        ? "bg-white text-gray-800 shadow-md drop-shadow-white"
                        : "text-gray-400 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
