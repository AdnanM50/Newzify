import { model, Schema } from 'mongoose';
import { TBlog } from './blog.interface';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new Schema<TBlog>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'blog-category',
            required: true,
        },
        tags: [
            {
                type: Schema.Types.ObjectId,
                ref: 'tag',
            },
        ],
        slug: {
            type: String,
            index: true,
        },
        is_deleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

schema.post<TBlog>('save', async function (doc: any, next): Promise<void> {
    doc.__v = undefined;
    next();
});

schema.plugin(aggregatePaginate);
const Blog = model<TBlog>('blog', schema);
export default Blog;
