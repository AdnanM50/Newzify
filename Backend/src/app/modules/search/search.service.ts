import News from '../news/news.model';
import Podcast from '../podcast/podcast.model';
import Editorial from '../editorial/editorial.model';
import Blog from '../blog/blog.model';

export default class SearchService {
    static async search(query: string, limit: number = 10) {
        const regex = { $regex: query, $options: 'i' };

        const [newsResults, podcastResults, editorialResults, blogResults] = await Promise.allSettled([
            News.find({
                is_deleted: false,
                status: 'published',
                $or: [{ title: regex }, { content: regex }],
            })
                .select('title slug image category createdAt')
                .populate('category', 'name slug')
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean(),

            Podcast.find({
                is_deleted: false,
                status: 'published',
                $or: [{ title: regex }, { description: regex }],
            })
                .select('title slug image category createdAt')
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean(),

            Editorial.find({
                is_deleted: false,
                status: 'published',
                $or: [{ title: regex }, { content: regex }, { subtitle: regex }],
            })
                .select('title slug image category createdAt')
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean(),

            Blog.find({
                is_deleted: false,
                $or: [{ title: regex }, { description: regex }],
            })
                .select('title slug image category createdAt')
                .populate('category', 'name slug')
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean(),
        ]);

        return {
            news: newsResults.status === 'fulfilled' ? newsResults.value : [],
            podcasts: podcastResults.status === 'fulfilled' ? podcastResults.value : [],
            editorials: editorialResults.status === 'fulfilled' ? editorialResults.value : [],
            blogs: blogResults.status === 'fulfilled' ? blogResults.value : [],
        };
    }
}
