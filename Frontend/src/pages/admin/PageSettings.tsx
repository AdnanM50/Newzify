import { useState, useEffect, useMemo } from "react";
import { useFetch, useAction } from "../../helpers/hooks";
import { getNewsList, getPageSettings, updatePageSettings, type TNews, type PaginatedResponse } from "../../helpers/backend";
import { Loader2, Save, Search, X, Check, Layout, PlayCircle, Layers, Image as ImageIcon } from "lucide-react";

const PageSettings = () => {
  const [heroNews, setHeroNews] = useState<string[]>([]);
  const [threeBoxNews, setThreeBoxNews] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"hero" | "threeBox">("hero");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: newsData, isLoading: isNewsLoading } = useFetch<PaginatedResponse<TNews>>(
    ["news", "all-for-settings"],
    () => getNewsList({ limit: 1000 }) // Load more for settings
  );
  const newsList = newsData?.docs || [];

  const { data: pageSettingsRaw, isLoading: isSettingsLoading, refetch: refetchSettings } = useFetch<any>(
    "page-settings",
    () => getPageSettings()
  );

  const pageSettings = pageSettingsRaw?.data;

  useEffect(() => {
    if (pageSettings) {
      setHeroNews(pageSettings.heroNews?.map((n: any) => typeof n === 'string' ? n : n._id) || []);
      setThreeBoxNews(pageSettings.threeBoxNews?.map((n: any) => typeof n === 'string' ? n : n._id) || []);
    }
  }, [pageSettings]);

  const { mutate: updateSettings, isPending: isSaving } = useAction(updatePageSettings, {
    successMessage: "Page Settings saved successfully!",
    onSuccess: () => refetchSettings(),
  });

  const handleSave = () => {
    if (threeBoxNews.length > 3) {
      alert("You can only select a maximum of 3 news articles for the 3-Box section.");
      return;
    }
    updateSettings({ heroNews, threeBoxNews });
  };

  const toggleSelection = (id: string) => {
    if (activeTab === "hero") {
      setHeroNews((prev) => 
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setThreeBoxNews((prev) => {
        if (prev.includes(id)) {
          return prev.filter((item) => item !== id);
        } else {
          if (prev.length >= 3) {
            alert("Maximum 3 news allowed for 3-Box section.");
            return prev;
          }
          return [...prev, id];
        }
      });
    }
  };

  const filteredNews = useMemo(() => {
    return newsList.filter(news => 
      news.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [newsList, searchTerm]);

  const selectedHeroItems = useMemo(() => {
    return newsList.filter(n => heroNews.includes(n._id));
  }, [newsList, heroNews]);

  const selectedThreeBoxItems = useMemo(() => {
    return newsList.filter(n => threeBoxNews.includes(n._id));
  }, [newsList, threeBoxNews]);

  const isSelected = (id: string) => {
    return activeTab === "hero" ? heroNews.includes(id) : threeBoxNews.includes(id);
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-serif tracking-tight">Home Page Configuration</h1>
          <p className="text-gray-500 mt-1">Curate yours news for the Hero carousel and Featured sections.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20 disabled:opacity-50 h-fit"
        >
          {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Publish Changes
        </button>
      </div>

      {(isNewsLoading || isSettingsLoading) ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <Loader2 className="animate-spin mb-4" size={48} />
          <p className="animate-pulse">Loading news repository...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Selection Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md">
              <button 
                onClick={() => setActiveTab("hero")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all ${activeTab === 'hero' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <PlayCircle size={18} />
                Hero Carousel
              </button>
              <button 
                onClick={() => setActiveTab("threeBox")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all ${activeTab === 'threeBox' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <Layers size={18} />
                3-Box Grid
              </button>
            </div>

            {/* Browser Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[700px]">
              <div className="p-6 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search titles, keywords, stories..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all"
                  />
                </div>
                <div className="text-sm font-medium text-gray-400">
                  {filteredNews.length} news available
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                {filteredNews.map((news) => {
                  const active = isSelected(news._id);
                  return (
                    <div 
                      key={news._id}
                      onClick={() => toggleSelection(news._id)}
                      className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${active ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200' : 'bg-white border-gray-100 hover:border-indigo-200 hover:shadow-md'}`}
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {news.image ? (
                          <img src={news.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ImageIcon size={24} />
                          </div>
                        )}
                        {active && (
                          <div className="absolute inset-0 bg-indigo-600/60 flex items-center justify-center">
                            <Check className="text-white" size={24} />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            {news.category && typeof news.category === 'object' ? (news.category as any).name : 'News'}
                          </span>
                          <span className="text-xs text-gray-400">
                            {news.createdAt ? new Date(news.createdAt).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        <h4 className={`font-bold text-gray-900 leading-tight line-clamp-2 ${active ? 'text-indigo-900 font-serif' : ''}`}>
                          {news.title}
                        </h4>
                      </div>

                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${active ? 'bg-indigo-600 border-indigo-600' : 'border-gray-200 group-hover:border-indigo-400'}`}>
                        {active && <Check className="text-white" size={14} />}
                      </div>
                    </div>
                  );
                })}
                {filteredNews.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <Search size={48} className="mb-2 opacity-20" />
                    <p>No matches found for your search.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Preview Side */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Hero Summary */}
            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Layout size={120} />
              </div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3 relative z-10">
                <PlayCircle className="text-indigo-400" />
                Hero Carousel
              </h3>
              
              <div className="space-y-4 mb-8 relative z-10">
                {selectedHeroItems.length > 0 ? selectedHeroItems.map((item) => (
                  <div key={`sel-hero-${item._id}`} className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-2xl backdrop-blur-sm group/item">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/10">
                      {item.image && <img src={item.image} className="w-full h-full object-cover" />}
                    </div>
                    <span className="text-sm font-medium line-clamp-1 flex-1">{item.title}</span>
                    <button 
                      onClick={() => setHeroNews(prev => prev.filter(id => id !== item._id))}
                      className="opacity-0 group-hover/item:opacity-100 p-1 hover:text-red-400 transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )) : (
                  <p className="text-gray-500 text-sm italic">No items selected for carousel.</p>
                )}
              </div>

              <div className="pt-6 border-t border-white/10 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">Active Slots</span>
                  <span className="text-2xl font-serif font-bold">{selectedHeroItems.length}</span>
                </div>
              </div>
            </div>

            {/* 3 Box Summary */}
            <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white shadow-2xl overflow-hidden relative group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Layers size={120} />
              </div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <Layers className="text-indigo-300" />
                  3-Box Grid
                </h3>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${selectedThreeBoxItems.length === 3 ? 'bg-green-500 text-white' : 'bg-white/10 text-white'}`}>
                  {selectedThreeBoxItems.length}/3
                </span>
              </div>

              <div className="space-y-4 mb-8 relative z-10">
                {selectedThreeBoxItems.length > 0 ? selectedThreeBoxItems.map((item) => (
                  <div key={`sel-3box-${item._id}`} className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-2xl backdrop-blur-sm group/item">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/10">
                      {item.image && <img src={item.image} className="w-full h-full object-cover" />}
                    </div>
                    <span className="text-sm font-medium line-clamp-1 flex-1">{item.title}</span>
                    <button 
                      onClick={() => setThreeBoxNews(prev => prev.filter(id => id !== item._id))}
                      className="opacity-0 group-hover/item:opacity-100 p-1 hover:text-red-400 transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )) : (
                  <p className="text-gray-400 text-sm italic">Select 3 featured news articles.</p>
                )}
              </div>

              {selectedThreeBoxItems.length < 3 && (
                <div className="p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl flex items-center gap-3 relative z-10">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  <p className="text-[10px] uppercase font-bold tracking-wider text-yellow-400">Needs {3 - selectedThreeBoxItems.length} more pieces</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default PageSettings;
