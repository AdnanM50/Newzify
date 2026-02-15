import React from 'react';
import { X, Calendar, User, Tag } from 'lucide-react';
import { type TNews } from '../../../helpers/backend';

interface NewsPreviewModalProps {
  news: TNews | null;
  isOpen: boolean;
  onClose: () => void;
}

const NewsPreviewModal: React.FC<NewsPreviewModalProps> = ({ news, isOpen, onClose }) => {
  if (!isOpen || !news) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-800">Article Preview</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-3xl mx-auto">
            {/* Category */}
            <div className="mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full uppercase tracking-wider">
                {typeof news.category === 'object' ? (news.category as any).name : news.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              {news.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-gray-500 border-y border-gray-100 py-4">
               <div className="flex items-center gap-2">
                 <User size={16} />
                 <span>By Admin</span>
               </div>
               <div className="flex items-center gap-2">
                 <Calendar size={16} />
                 <span>{news.createdAt ? new Date(news.createdAt).toLocaleDateString() : 'Just now'}</span>
               </div>
               {news.types && news.types.length > 0 && (
                 <div className="flex items-center gap-2">
                   <Tag size={16} />
                   <span className="flex gap-1">
                     {news.types.map(t => <span key={t} className="capitalize">{t}</span>)}
                   </span>
                 </div>
               )}
            </div>

            {/* Image */}
            <div className="mb-10 rounded-2xl overflow-hidden shadow-lg aspect-video">
               <img 
                 src={news.image} 
                 alt={news.title}
                 className="w-full h-full object-cover"
               />
            </div>

            {/* Body */}
            <div 
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsPreviewModal;
