import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Heart, Reply, Calendar } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface UserComment {
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
  createdAt: string;
  replyCount?: number;
  likeCount?: number;
}

interface UserCommentsSectionProps {
  comments: UserComment[];
  isLoading: boolean;
}

export const UserCommentsSection: React.FC<UserCommentsSectionProps> = ({ comments, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-gray-100 p-6">
            <MessageSquare className="h-12 w-12 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">No comments yet</h3>
            <p className="text-sm text-gray-500 mt-1">
              Share your thoughts on news articles
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment._id} className="hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-base">
              <Link
                to="/news/$newsId"
                params={{ newsId: comment.newsId._id }}
                className="hover:text-red-600 transition-colors"
              >
                {comment.newsId.title}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border-l-4 border-red-500">
              {comment.content}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(comment.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Reply className="h-3 w-3" />
                  {comment.replyCount || 0} {comment.replyCount === 1 ? 'reply' : 'replies'}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {comment.likeCount || 0} {comment.likeCount === 1 ? 'like' : 'likes'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
