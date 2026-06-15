import { X } from "lucide-react";
import { type TPodcast } from "../../../helpers/backend";

interface PodcastPreviewModalProps {
  podcast: TPodcast | null;
  isOpen: boolean;
  onClose: () => void;
}

const PodcastPreviewModal = ({ podcast, isOpen, onClose }: PodcastPreviewModalProps) => {
  if (!isOpen || !podcast) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Podcast Preview</h3>
            <p className="text-sm text-gray-500 mt-0.5">How this podcast will appear on the site</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-white">
          <div className="max-w-4xl mx-auto">
            {/* Podcast Header */}
            <div className="mb-6">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                HOME / PODCAST
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight font-serif">
                {podcast.title}
              </h1>
            </div>

            {/* Player */}
            <div className="mb-8 w-full rounded-xl overflow-hidden shadow-sm podcast-player-wrapper">
               {podcast.audio_url ? (
                <audio controls className="w-full">
                  <source src={podcast.audio_url} />
                  Your browser does not support the audio element.
                </audio>
               ) : (
                <div dangerouslySetInnerHTML={{ __html: podcast.embed_code || "" }} />
               )}
            </div>

            {/* Podcast Description Body */}
            <div 
              className="prose prose-lg max-w-none prose-green prose-headings:text-gray-900 prose-p:text-gray-700"
              dangerouslySetInnerHTML={{ __html: podcast.description }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default PodcastPreviewModal;
