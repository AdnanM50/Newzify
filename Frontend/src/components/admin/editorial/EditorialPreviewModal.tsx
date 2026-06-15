import { X } from "lucide-react";
import { type TEditorial } from "../../../helpers/backend";

interface EditorialPreviewModalProps {
  editorial: TEditorial | null;
  isOpen: boolean;
  onClose: () => void;
}

const EditorialPreviewModal = ({ editorial, isOpen, onClose }: EditorialPreviewModalProps) => {
  if (!isOpen || !editorial) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Editorial Preview</h3>
            <p className="text-sm text-gray-500 mt-0.5">How this editorial will appear on the site</p>
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
          <div className="max-w-3xl mx-auto">
            {/* Editorial Header */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold uppercase rounded-full">
                  {editorial.category?.replace('-', ' ')}
                </span>
                {editorial.is_editors_pick && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold uppercase rounded-full">
                    Editor's Pick
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight font-serif">
                {editorial.title}
              </h1>

              {editorial.subtitle && (
                <p className="text-xl text-gray-600 mb-6 italic border-l-4 border-indigo-200 pl-4">
                  {editorial.subtitle}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-500 py-4 border-y border-gray-100">
                <div className="font-medium text-gray-900">
                  By {editorial.author ? `${editorial.author.first_name} ${editorial.author.last_name || ''}` : 'Unknown Author'}
                </div>
                <span>•</span>
                <div>
                  {editorial.createdAt ? new Date(editorial.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Date not available'}
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {editorial.image && (
              <div className="mb-8 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                <img 
                  src={editorial.image} 
                  alt={editorial.title}
                  className="w-full h-auto max-h-[400px] object-cover"
                />
              </div>
            )}

            {/* Editorial Body */}
            <div 
              className="prose prose-lg max-w-none prose-indigo prose-headings:text-gray-900 prose-p:text-gray-700"
              dangerouslySetInnerHTML={{ __html: editorial.content }}
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

export default EditorialPreviewModal;
