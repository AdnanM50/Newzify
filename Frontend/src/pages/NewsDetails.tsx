import React from 'react';
import { useFetch, useAction } from '../helpers/hooks';
import { getPublicNewsById, toggleLikeNews } from '../helpers/backend';
import { useParams } from '@tanstack/react-router';
import { Calendar, User, Tag, ArrowLeft, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from '@tanstack/react-router';
import CommentSection from '../components/comments/CommentSection';
import { useUser } from '../context/user';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon
} from 'react-share';

const NewsDetails: React.FC = () => {
  const { newsId } = useParams({ from: '/news/$newsId' });
  const { user } = useUser();
  const shareUrl = window.location.href;

  const { data: news, isLoading, error, refetch } = useFetch('news-details', getPublicNewsById, {
    id: newsId
  });

  const { mutate: likeNews, isLoading: isLiking } = useAction(toggleLikeNews, {
    showSuccessToast: false,
    onSuccess: () => {
      refetch();
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">News Not Found</h1>
        <p className="text-gray-600 mb-8">The news article you are looking for does not exist or has been removed.</p>
        <Button asChild className="bg-red-600 hover:bg-red-700">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const isLiked = user && news.likes?.some((id: any) => (typeof id === 'string' ? id === user._id : id._id === user._id));

  const handleLike = () => {
    if (!user) {
      return;
    }
    likeNews({ id: newsId });
  };

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" asChild className="mb-8 hover:bg-gray-100">
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>

      <header className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {news.category && (
            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold uppercase rounded-full">
              {typeof news.category === 'object' ? news.category.name : 'News'}
            </span>
          )}
          {news.types?.map((type: string) => (
            <span key={type} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold uppercase rounded-full">
              {type}
            </span>
          ))}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {news.title}
        </h1>

        <div className="flex flex-wrap items-center text-sm text-gray-500 gap-6 border-y border-gray-100 py-4">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            <span className="font-medium text-gray-900 capitalize">
              {news.author ? `${news.author.first_name} ${news.author.last_name} (${news.author.role})` : 'Admin'}
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(news.createdAt as string).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div className="flex items-center gap-4 ml-auto">
             <Button 
                variant="ghost" 
                size="sm" 
                className={`flex items-center gap-1.5 ${isLiked ? 'text-red-600 hover:text-red-700' : 'text-gray-500 hover:text-red-600'}`}
                onClick={handleLike}
                disabled={isLiking || !user}
             >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="font-semibold">{news.likes?.length || 0}</span>
             </Button>
             
             <div className="flex items-center gap-2 border-l pl-4">
                <span className="text-xs font-bold text-gray-400 uppercase">Share:</span>
                <FacebookShareButton url={shareUrl}>
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} title={news.title}>
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <LinkedinShareButton url={shareUrl} title={news.title}>
                  <LinkedinIcon size={32} round />
                </LinkedinShareButton>
                <WhatsappShareButton url={shareUrl} title={news.title} separator=":: ">
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
             </div>
          </div>
        </div>
      </header>

      {news.image && (
        <div className="mb-10 overflow-hidden rounded-2xl shadow-lg">
          <img 
            src={news.image} 
            alt={news.title}
            className="w-full h-auto max-h-[500px] object-cover"
          />
        </div>
      )}

      <div 
        className="prose prose-lg max-w-none prose-red prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-red-600"
        dangerouslySetInnerHTML={{ __html: news.content }}
      />

      <footer className="mt-16 pt-8 border-t border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500 font-medium">Keywords:</span>
            <div className="flex gap-2">
              {news.types?.map((type: string) => (
                <span key={type} className="text-sm text-gray-900 hover:text-red-600 cursor-pointer">
                  #{type}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <CommentSection newsId={newsId} />
    </article>
  );
};

export default NewsDetails;
