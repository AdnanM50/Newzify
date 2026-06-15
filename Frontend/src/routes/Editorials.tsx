import { createFileRoute, Link } from '@tanstack/react-router'
import { useFetch } from '../helpers/hooks'
import { getPublicEditorialsList, type TEditorial, type PaginatedResponse } from '../helpers/backend'
import { Loader2, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/Editorials')({
  component: EditorialsPage,
})

function EditorialsPage() {
  const { data: editorialData, isLoading } = useFetch<PaginatedResponse<TEditorial>>(
    "public-editorials",
    () => getPublicEditorialsList()
  );

  const editorials = editorialData?.docs || [];
  
  // Split editorials
  const editorsPicks = editorials.filter(ed => ed.is_editors_pick).slice(0, 5);
  // Main featured editorial is the latest one that is not in the editors pick (or just the very latest if not enough)
  let featuredEditorial = editorials.find(ed => !ed.is_editors_pick);
  if (!featuredEditorial && editorials.length > 0) featuredEditorial = editorials[0];
  
  // Grid editorials (exclude featured and editors picks)
  const gridEditorials = editorials.filter(ed => 
    ed._id !== featuredEditorial?._id && 
    !editorsPicks.find(ep => ep._id === ed._id)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 border-b-4 border-black pb-4">
        <h1 className="text-5xl md:text-7xl font-black font-serif uppercase tracking-tighter">Editorials</h1>
        <p className="text-xl text-gray-500 font-serif italic mt-2">Views, opinions, and geopolitical insights.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 mb-16">
        
        {/* Editor's Pick Sidebar */}
        <div className="w-full lg:w-1/4 lg:order-1 order-2">
          <div className="border-t-2 border-red-600 pt-4 mb-6">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Editor's Pick</h2>
            <div className="flex flex-col gap-6">
              {editorsPicks.length > 0 ? editorsPicks.map((pick) => (
                <Link 
                  key={pick._id} 
                  to="/editorials/$editorialId"
                  params={{ editorialId: pick._id }}
                  className="editors-pick-card block px-2 group"
                >
                  <div className="text-xs font-bold text-red-600 uppercase mb-1">
                    {pick.category?.replace('-', ' ')}
                  </div>
                  <h3 className="text-lg font-bold font-serif leading-snug group-hover:text-red-700 transition-colors">
                    {pick.title}
                  </h3>
                  <div className="text-xs text-gray-500 mt-2 font-medium uppercase tracking-wider">
                    {pick.author ? `${pick.author.first_name} ${pick.author.last_name || ``}` : `The Editorial Board`}
                  </div>
                </Link>
              )) : (
                <p className="text-gray-500 italic">No editor's picks at this time.</p>
              )}
            </div>
          </div>
        </div>

        {/* Featured Editorial */}
        {featuredEditorial && (
          <div className="w-full lg:w-3/4 lg:order-2 order-1 border-l border-gray-200 lg:pl-12">
            <Link 
              to="/editorials/$editorialId"
              params={{ editorialId: featuredEditorial._id }}
              className="group block"
            >
              <div className="mb-6 overflow-hidden bg-gray-100">
                {featuredEditorial.image && (
                  <img 
                    src={featuredEditorial.image} 
                    alt={featuredEditorial.title}
                    className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
              </div>
              <div className="max-w-3xl mx-auto text-center">
                <span className="inline-block px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-widest mb-4">
                  {featuredEditorial.category?.replace('-', ' ')}
                </span>
                <h2 className="text-4xl md:text-5xl font-black font-serif uppercase tracking-tight leading-none mb-4 group-hover:text-red-600 transition-colors">
                  {featuredEditorial.title}
                </h2>
                {featuredEditorial.subtitle && (
                  <p className="text-xl text-gray-600 font-serif italic mb-6">
                    "{featuredEditorial.subtitle}"
                  </p>
                )}
                <div className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center justify-center gap-2">
                  Read Full Editorial <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Grid of other editorials */}
      {gridEditorials.length > 0 && (
        <div className="border-t border-gray-200 pt-12">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-8 font-serif">More Editorials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridEditorials.map((ed) => (
              <Link 
                key={ed._id} 
                to="/editorials/$editorialId"
                params={{ editorialId: ed._id }}
                className="group flex flex-col h-full"
              >
                <div className="overflow-hidden mb-4 bg-gray-100 h-48">
                  {ed.image && (
                    <img 
                      src={ed.image} 
                      alt={ed.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                <div className="text-xs font-bold text-red-600 uppercase mb-2 tracking-wider">
                  {ed.category?.replace('-', ' ')}
                </div>
                <h3 className="text-2xl font-bold font-serif leading-tight group-hover:text-red-600 transition-colors mb-3">
                  {ed.title}
                </h3>
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium uppercase tracking-wider">
                  <span>{ed.author ? `${ed.author.first_name}` : `Editorial Board`}</span>
                  <span>{ed.createdAt ? new Date(ed.createdAt).toLocaleDateString() : ''}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
