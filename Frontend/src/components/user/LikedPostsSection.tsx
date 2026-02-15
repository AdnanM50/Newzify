import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Calendar, Tag } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface LikedPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  image?: string;
  category?: {
    _id: string;
    name: string;
  };
  author?: {
    _id: string;
    first_name: string;
    last_name: string;
    image?: string;
  };
  createdAt: string;
  likes?: string[];
}

interface LikedPostsSectionProps {
  posts: LikedPost[];
  isLoading: boolean;
}

export const LikedPostsSection: React.FC<LikedPostsSectionProps> = ({ posts, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

  if (!posts || posts.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-gray-100 p-6">
            <Heart className="h-12 w-12 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">No liked posts yet</h3>
            <p className="text-sm text-gray-500 mt-1">
              Start exploring and like posts that interest you
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Card key={post._id} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg line-clamp-2">
                <Link
                  to="/news/$newsId"
                  params={{ newsId: post._id }}
                  className="hover:text-red-600 transition-colors"
                >
                  {post.title}
                </Link>
              </CardTitle>
            </div>
            {post.category && (
              <Badge variant="secondary" className="w-fit mt-2">
                <Tag className="h-3 w-3 mr-1" />
                {post.category.name}
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 line-clamp-3 mb-4">
              {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3 fill-red-500 text-red-500" />
                {post.likes?.length || 0}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
