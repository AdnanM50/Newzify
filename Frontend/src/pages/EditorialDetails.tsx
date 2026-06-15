import React from 'react';
import { useFetch } from '../helpers/hooks';
import { getPublicEditorialById, type TEditorial } from '../helpers/backend';
import { useParams, Link } from '@tanstack/react-router';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
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

const EditorialDetails: React.FC = () => {
  const { editorialId } = useParams({ from: '/editorials/$editorialId' });
  const shareUrl = window.location.href;

  const { data: editorial, isLoading, error } = useFetch<TEditorial>('editorial-details', getPublicEditorialById, {
    id: editorialId
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !editorial) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Editorial Not Found</h1>
        <p className="text-gray-600 mb-8">The editorial you are looking for does not exist or has been removed.</p>
        <Button asChild className="bg-red-600 hover:bg-red-700">
          <Link to="/editorials">Back to Editorials</Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-5xl">
      <Button variant="ghost" asChild className="mb-8 hover:bg-gray-100">
        <Link to="/editorials">
          <ArrowLeft className="mr-2 h-4 w-4" />
          All Editorials
        </Link>
      </Button>

      {/* Daily Star Style Header */}
      <header className="mb-10 text-center max-w-4xl mx-auto border-b-2 border-black pb-8">
        <div className="flex justify-center gap-2 mb-6">
          <span className="px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-widest">
            {editorial.category?.replace('-', ' ')}
          </span>
          {editorial.is_editors_pick && (
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-widest">
              Editor's Pick
            </span>
          )}
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight font-serif uppercase tracking-tight">
          {editorial.title}
        </h1>

        {editorial.subtitle && (
          <p className="text-xl md:text-2xl text-gray-700 mb-8 font-serif italic max-w-3xl mx-auto">
            "{editorial.subtitle}"
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center text-sm text-gray-600 gap-6 uppercase font-bold tracking-wider">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            <span>
              By {editorial.author ? `${editorial.author.first_name} ${editorial.author.last_name || ''}` : 'The Editorial Board'}
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            {editorial.createdAt ? new Date(editorial.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : ''}
          </div>
        </div>
      </header>

      {/* Hero Image */}
      {editorial.image && (
        <div className="mb-12 overflow-hidden shadow-sm">
          <img 
            src={editorial.image} 
            alt={editorial.title}
            className="w-full h-auto max-h-[600px] object-cover"
          />
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-12 max-w-4xl mx-auto">
        {/* Share Sidebar */}
        <div className="md:w-16 flex-shrink-0">
            <div className="sticky top-32 flex flex-col gap-4 items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2" style={{ writingMode: 'vertical-rl' }}>Share</span>
                <FacebookShareButton url={shareUrl}>
                  <FacebookIcon size={40} round className="hover:scale-110 transition-transform" />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} title={editorial.title}>
                  <TwitterIcon size={40} round className="hover:scale-110 transition-transform" />
                </TwitterShareButton>
                <LinkedinShareButton url={shareUrl} title={editorial.title}>
                  <LinkedinIcon size={40} round className="hover:scale-110 transition-transform" />
                </LinkedinShareButton>
                <WhatsappShareButton url={shareUrl} title={editorial.title}>
                  <WhatsappIcon size={40} round className="hover:scale-110 transition-transform" />
                </WhatsappShareButton>
            </div>
        </div>

        {/* Content with Drop Cap */}
        <div className="flex-1">
            <div 
                className="editorial-drop-cap editorial-content font-serif"
                dangerouslySetInnerHTML={{ __html: editorial.content }}
            />
        </div>
      </div>
    </article>
  );
};

export default EditorialDetails;
