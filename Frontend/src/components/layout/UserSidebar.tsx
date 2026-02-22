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

import { Link } from '@tanstack/react-router';

interface Props {
  className?: string;
  user?: UserProfile | null;
}

const UserSidebar: React.FC<Props> = ({ className = '', user }) => {
  const getInitials = () => {
    if (!user) return 'U';
    return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
  };

  const getMemberSince = () => {
    if (!user?.createdAt) return '2024';
    return new Date(user.createdAt).getFullYear().toString();
  };

  const navItems = [
    { to: '/dashboard/likes', label: 'Liked Posts', icon: Heart },
    { to: '/dashboard/comments', label: 'Your Comments', icon: MessageSquare },
    { to: '/dashboard/replies', label: 'Replies', icon: Reply },
    { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <Card className={`sticky top-4 ${className}`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-row lg:flex-col items-center lg:items-center gap-4 lg:gap-0 lg:mb-6">
          <Avatar className="h-12 w-12 sm:h-20 sm:w-20 lg:mb-3 flex-shrink-0">
            <AvatarImage src={user?.image} alt={user?.first_name || 'User'} />
            <AvatarFallback className="text-lg sm:text-xl bg-red-100 text-red-600">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="text-left lg:text-center min-w-0">
            <div className="font-semibold text-base sm:text-lg truncate">
              {user ? `${user.first_name} ${user.last_name}` : 'Loading...'}
            </div>
            <div className="text-xs sm:text-sm text-gray-500">Member since {getMemberSince()}</div>
          </div>
        </div>

        <nav className="mt-4 lg:mt-0 grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-md transition-colors text-xs sm:text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600"
              activeProps={{
                className: 'bg-red-50 text-red-600 font-medium',
              }}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
};

export default UserSidebar;
