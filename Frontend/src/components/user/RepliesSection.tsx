import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Reply as ReplyIcon, Calendar, ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface ReplyData {
  _id: string;
  content: string;
  newsId: {
    _id: string;
    title: string;
    slug: string;
  };
  userId: {
    _id: string;
    first_name: string;
    last_name: string;
    image?: string;
  };
  parentCommentId: {
    _id: string;
    content: string;
  };
  createdAt: string;
}

interface RepliesSectionProps {
  replies: ReplyData[];
  isLoading: boolean;
}

export const RepliesSection: React.FC<RepliesSectionProps> = ({ replies, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!replies || replies.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-gray-100 p-6">
            <ReplyIcon className="h-12 w-12 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">No replies yet</h3>
            <p className="text-sm text-gray-500 mt-1">
              When others reply to your comments, they'll appear here
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-4">
      {replies.map((reply) => (
        <Card key={reply._id} className="hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-base">
              <Link
                to="/news/$newsId"
                params={{ newsId: reply.newsId._id }}
                className="hover:text-red-600 transition-colors"
              >
                {reply.newsId.title}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Original Comment */}
            <div className="bg-gray-50 p-3 rounded-md border-l-4 border-gray-300">
              <p className="text-xs text-gray-500 mb-1">Your comment:</p>
              <p className="text-sm text-gray-700 line-clamp-2">
                {reply.parentCommentId.content}
              </p>
            </div>

            {/* Reply Arrow */}
            <div className="flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>

            {/* Reply */}
            <div className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-500">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={reply.userId.image} alt={reply.userId.first_name} />
                  <AvatarFallback className="text-xs">
                    {getInitials(reply.userId.first_name, reply.userId.last_name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium text-gray-700">
                  {reply.userId.first_name} {reply.userId.last_name}
                </span>
                <span className="text-xs text-gray-500">replied:</span>
              </div>
              <p className="text-sm text-gray-700">{reply.content}</p>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              {new Date(reply.createdAt).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
