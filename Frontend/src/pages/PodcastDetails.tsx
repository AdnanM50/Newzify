import React from 'react';
import { useFetch } from '../helpers/hooks';
import { getPublicPodcastById, type TPodcast } from '../helpers/backend';
import { useParams, Link } from '@tanstack/react-router';
import { Bookmark, MessageCircle } from 'lucide-react';

const PodcastDetails: React.FC = () => {
  const { podcastId } = useParams({ from: '/podcasts/$podcastId' });

  const { data: podcast, isLoading, error } = useFetch<TPodcast>('podcast-details', getPublicPodcastById, {
    id: podcastId
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error || !podcast) {
    return (
      <div className="container mx-auto px-4 py-16 text-center bg-white">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Podcast Not Found</h1>
        <p className="text-gray-600 mb-8">The podcast you are looking for does not exist or has been removed.</p>
        <Link to="/podcasts" className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800">
          Back to Podcasts
        </Link>
      </div>
    );
  }

  return (
    <article className="bg-white min-h-screen pb-16">
        {/* Navigation Top Bar mock */}
        <div className="border-b border-gray-200 py-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link to="/podcasts" className="font-serif font-black text-3xl tracking-tighter">NEWZIFY</Link>
            </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-5xl">
            {/* Breadcrumb */}
            <div className="text-xs font-bold text-red-600 uppercase tracking-widest mb-6">
                HOME / PODCAST
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight font-serif tracking-tight">
                {podcast.title}
            </h1>

            {/* Actions */}
            <div className="flex items-center gap-6 mb-10 text-gray-600 border-b border-gray-100 pb-6">
                <button className="flex items-center gap-2 hover:text-black transition-colors font-semibold text-sm">
                    <MessageCircle size={18} />
                    <span className="sr-only">Comments</span>
                </button>
                <button className="flex items-center gap-2 hover:text-black transition-colors font-semibold text-sm uppercase tracking-wider">
                    <Bookmark size={18} />
                    READ LATER
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Main Content */}
                <div className="lg:w-2/3">
                    {/* Player */}
                    <div className="mb-10 w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-gray-50 p-2 podcast-player-wrapper">
                        {podcast.audio_url ? (
                            <audio controls className="w-full">
                                <source src={podcast.audio_url} />
                                Your browser does not support the audio element.
                            </audio>
                        ) : (
                            <div dangerouslySetInnerHTML={{ __html: podcast.embed_code || "" }} />
                        )}
                    </div>

                    {/* Article Description */}
                    <div 
                        className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-800 prose-a:text-blue-600 font-serif leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: podcast.description }}
                    />
                </div>

                {/* Sidebar Advertisement Placeholder (Like in the design) */}
                <div className="lg:w-1/3 hidden lg:block space-y-8">
                    <div className="bg-gray-100 p-4 border border-gray-200 min-h-[300px] flex items-center justify-center text-gray-400 text-sm font-medium uppercase tracking-widest text-center relative">
                        <span className="absolute top-2 right-2 text-[10px] text-gray-400">AdChoices</span>
                        Advertisement Area
                    </div>
                    <div className="text-center text-xs text-gray-400 uppercase tracking-widest mb-2">Advertisement</div>
                    <div className="bg-gray-100 p-4 border border-gray-200 min-h-[250px] flex items-center justify-center text-gray-400 text-sm font-medium uppercase tracking-widest text-center relative">
                         <span className="absolute top-2 right-2 text-[10px] text-gray-400">AdChoices</span>
                        Secondary Ad Space
                    </div>
                </div>
            </div>
        </div>
    </article>
  );
};

export default PodcastDetails;
