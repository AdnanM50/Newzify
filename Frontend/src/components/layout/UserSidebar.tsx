import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, MessageSquare, Reply, Settings } from 'lucide-react';

interface UserProfile {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  image?: string;
  createdAt: string;
}

interface Props {
  className?: string;
  user?: UserProfile | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const UserSidebar: React.FC<Props> = ({ className = '', user, activeTab, onTabChange }) => {
  const getInitials = () => {
    if (!user) return 'U';
    return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
  };

  const getMemberSince = () => {
    if (!user?.createdAt) return '2024';
    return new Date(user.createdAt).getFullYear().toString();
  };

  const navItems = [
    { id: 'liked', label: 'Liked Posts', icon: Heart },
    { id: 'comments', label: 'Your Comments', icon: MessageSquare },
    { id: 'replies', label: 'Replies', icon: Reply },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <Card className={`sticky top-4 ${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-20 w-20 mb-3">
            <AvatarImage src={user?.image} alt={user?.first_name || 'User'} />
            <AvatarFallback className="text-xl bg-red-100 text-red-600">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <div className="font-semibold text-lg">
              {user ? `${user.first_name} ${user.last_name}` : 'Loading...'}
            </div>
            <div className="text-sm text-gray-500">Member since {getMemberSince()}</div>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors text-left ${
                activeTab === item.id
                  ? 'bg-red-50 text-red-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-red-600'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
};

export default UserSidebar;
