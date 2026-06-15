import { createFileRoute, Link } from '@tanstack/react-router'
import { useFetch } from '../helpers/hooks'
import { getPublicPodcastsList, type TPodcast, type PaginatedResponse } from '../helpers/backend'
import { Headphones } from 'lucide-react'

export const Route = createFileRoute('/Podcasts')({
  component: PodcastsPage,
})

function PodcastsPage() {
  const { data: podcastData, isLoading } = useFetch<PaginatedResponse<TPodcast>>(
    "public-podcasts",
    () => getPublicPodcastsList({ is_featured: "true", limit: "5" }) // Fetch top 5 featured
  );

  const featuredPodcasts = podcastData?.docs || [];

  if (isLoading) {
    return (
      <div className="podcast-page flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="podcast-page">
      <div className="container mx-auto px-4 max-w-7xl">
        <header className="podcast-header">
          <h1>5 podcasts to listen to today</h1>
        </header>

        <div className="podcast-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {featuredPodcasts.length > 0 ? (
            featuredPodcasts.map((podcast, index) => (
              <Link 
                key={podcast._id} 
                to="/podcasts/$podcastId"
                params={{ podcastId: podcast._id }}
                className={`podcast-card ${index === 0 ? 'md:col-span-2 lg:col-span-2 lg:row-span-2' : ''}`}
              >
                <div className={`podcast-image-wrapper ${index === 0 ? 'h-64 md:h-full lg:h-[600px] mb-4' : 'h-64 mb-4'}`}>
                  {podcast.image ? (
                    <img src={podcast.image} alt={podcast.title} />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <Headphones className="text-gray-600" size={48} />
                    </div>
                  )}
                  {/* Overlay Icons */}
                  <div className="podcast-icon-overlay">
                    <div className="th-icon">TH</div>
                    <div className="headphone-icon">
                      <Headphones size={16} />
                    </div>
                  </div>
                </div>
                
                <div className="podcast-label uppercase">
                  PODCAST
                </div>
                <h2 className={`podcast-title ${index === 0 ? 'md:text-3xl lg:text-4xl' : 'text-xl'}`}>
                  {podcast.title}
                </h2>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-500">
               <Headphones size={48} className="mx-auto mb-4 opacity-50" />
               <p className="text-xl">No featured podcasts available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
