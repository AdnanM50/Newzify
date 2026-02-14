import { useState } from "react";
import ProfileUpdateForm from "./ProfileUpdateForm";
import ChangePasswordForm from "./ChangePasswordForm";
import { User, Lock, ChevronRight, Settings } from "lucide-react";
import { cn } from "../../lib/utils";

const AdminProfile = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  const tabs = [
    {
      id: "profile",
      label: "Profile Information",
      icon: User,
      description: "Manage your account details and settings"
    },
    {
      id: "password",
      label: "Security & Password",
      icon: Lock,
      description: "Update your password and secure your account"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
            <Settings className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-gray-500 text-sm">Manage your profile information and security preferences</p>
          </div>
        </div>
        
        {/* Breadcrumb-like indicator */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-indigo-600 transition-colors cursor-pointer">Admin</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Profile</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-4 space-y-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "w-full text-left p-4 rounded-xl transition-all duration-200 group flex items-start gap-4 border-2",
                  isActive 
                    ? "bg-white border-indigo-600 shadow-md ring-4 ring-indigo-50" 
                    : "bg-transparent border-transparent hover:bg-white hover:border-gray-200"
                )}
              >
                <div className={cn(
                  "p-2.5 rounded-lg transition-colors",
                  isActive ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                )}>
                  <tab.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={cn(
                    "font-semibold transition-colors",
                    isActive ? "text-gray-900" : "text-gray-600"
                  )}>
                    {tab.label}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                    {tab.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Form Content Area */}
        <div className="lg:col-span-8">
          <div className="transition-all duration-300 ease-in-out transform">
            {activeTab === "profile" ? (
              <div className="animate-in slide-in-from-right-4 duration-300">
                <ProfileUpdateForm />
              </div>
            ) : (
              <div className="animate-in slide-in-from-right-4 duration-300">
                <ChangePasswordForm />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;