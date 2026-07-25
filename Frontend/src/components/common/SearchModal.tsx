import React, { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, Newspaper, Mic, BookOpen, FileText } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useFetch } from '../../helpers/hooks';
import { searchContent, type TSearchResult } from '../../helpers/backend';
import { useNavigate } from '@tanstack/react-router';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: results, isLoading } = useFetch<TSearchResult>(
    ['search', debouncedQuery],
    searchContent,
    { q: debouncedQuery, limit: 8 },
    { enabled: debouncedQuery.length >= 2 }
  );

  const handleNavigate = useCallback((type: string, slug?: string, id?: string) => {
    const path = type === 'news' ? `/news/${id}`
      : type === 'podcasts' ? `/podcasts/${id}`
      : type === 'editorials' ? `/editorials/${id}`
      : `/blog/${id}`;
    navigate({ to: path as any });
    onClose();
    setSearchQuery('');
  }, [navigate, onClose]);

  const sections = results ? [
    { key: 'news', label: 'News', icon: Newspaper, items: results.news, color: 'text-red-600' },
    { key: 'podcasts', label: 'Podcasts', icon: Mic, items: results.podcasts, color: 'text-purple-600' },
    { key: 'editorials', label: 'Editorials', icon: BookOpen, items: results.editorials, color: 'text-blue-600' },
    { key: 'blogs', label: 'Blogs', icon: FileText, items: results.blogs, color: 'text-green-600' },
  ].filter(s => s.items.length > 0) : [];

  const hasResults = sections.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 rounded-xl overflow-hidden">
        <div className="flex items-center border-b px-4 py-3">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search news, podcasts, editorials, blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 ml-3 text-sm outline-none bg-transparent placeholder:text-gray-400"
          />
          {isLoading && <Loader2 className="w-4 h-4 text-gray-400 animate-spin shrink-0" />}
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {debouncedQuery.length < 2 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              Type at least 2 characters to search
            </div>
          ) : !isLoading && !hasResults ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              No results found for "{debouncedQuery}"
            </div>
          ) : (
            <div className="py-2">
              {sections.map((section) => (
                <div key={section.key}>
                  <div className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider ${section.color}`}>
                    <section.icon className="w-3.5 h-3.5" />
                    {section.label}
                  </div>
                  {section.items.map((item: any) => (
                    <button
                      key={item._id}
                      onClick={() => handleNavigate(section.key, item.slug, item._id)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                    >
                      {item.image ? (
                        <img src={item.image} alt="" className="w-10 h-10 rounded object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center shrink-0">
                          <section.icon className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-800 truncate">{item.title}</div>
                        <div className="text-xs text-gray-400">
                          {typeof item.category === 'object' ? item.category?.name : item.category || section.label}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
