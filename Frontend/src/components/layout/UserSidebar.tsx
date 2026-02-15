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

  const scrollToSection = (sectionId: string) => {
    // This will trigger the tab change in the parent component
    const tabTrigger = document.querySelector(`[value="${sectionId}"]`) as HTMLElement;
    if (tabTrigger) {
      tabTrigger.click();
    }
  };

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
          <button
            onClick={() => scrollToSection('liked')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 hover:text-red-600 rounded-md transition-colors text-left"
          >
            <Heart className="h-4 w-4" />
            <span>Liked Posts</span>
          </button>
          <button
            onClick={() => scrollToSection('comments')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 hover:text-red-600 rounded-md transition-colors text-left"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Your Comments</span>
          </button>
          <button
            onClick={() => scrollToSection('replies')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 hover:text-red-600 rounded-md transition-colors text-left"
          >
            <Reply className="h-4 w-4" />
            <span>Replies</span>
          </button>
          <button
            onClick={() => scrollToSection('settings')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 hover:text-red-600 rounded-md transition-colors text-left"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </nav>
      </CardContent>
    </Card>
  );
};

export default UserSidebar;
