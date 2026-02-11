// import React from 'react';
import { useFetch } from '../helpers/hooks';
import { getPublicNewsList, getCategoryBySlug } from '../helpers/backend';
import { Link } from '@tanstack/react-router';

const CategoryPage = ({ slug }: { slug: string }) => {
    // 1. Fetch category details to get ID
    const { data: category, isLoading: isCatLoading } = useFetch(["category", slug], getCategoryBySlug, { slug });

    // 2. Fetch news filtering by category ID (once category is loaded)
    const { data: newsData, isLoading: isNewsLoading } = useFetch(
        ["categoryNews", category?._id as string],
        getPublicNewsList,
        { category: category?._id, limit: 12 },
        { enabled: !!category?._id }
    );

    if (isCatLoading) return <div className="container mx-auto p-8 text-center">Loading category...</div>;
    if (!category) return <div className="container mx-auto p-8 text-center text-red-500 font-bold">Category not found</div>;

    const newsItems = newsData?.docs || [];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 border-b border-gray-200 pb-4">
                <h1 className="text-4xl font-bold text-gray-800 font-serif uppercase tracking-tight">
                    {category.name}
                </h1>
                <p className="text-gray-500 mt-2">Showing all news in {category.name}</p>
            </div>

            {isNewsLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
            ) : newsItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {newsItems.map((news: any) => (
                        <div key={news._id} className="group border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-all">
                            <Link to={`/news/${news._id}` as any}>
                                <div className="aspect-video overflow-hidden">
                                    <img 
                                        src={news.image || 'https://via.placeholder.com/800x450?text=News+Image'} 
                                        alt={news.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-4">
                                    <h2 className="text-xl font-bold text-gray-800 leading-tight mb-2 group-hover:text-red-600 transition-colors">
                                        {news.title}
                                    </h2>
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                        {news.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                                    </p>
                                    <div className="flex justify-between items-center text-xs text-gray-400">
                                        <span>By {news.author?.first_name || 'Admin'}</span>
                                        <span>{new Date(news.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 text-lg">No news found in this category yet.</p>
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
