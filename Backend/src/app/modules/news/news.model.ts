import { model, Schema } from 'mongoose';
import { TNews } from './news.interface';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new Schema<TNews>(
    {
        title: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            index: true,
        },
        content: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'category',
        },
        types: {
            type: [String],
            enum: ['trending', 'latest', 'popular', 'fresh', 'top'],
            default: [],
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'draft',
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user',
            },
        ],
        is_deleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

schema.post<TNews>('save', async function (doc: any, next): Promise<void> {
    doc.__v = undefined;
    next();
});

schema.plugin(aggregatePaginate);
const News = model<TNews>('news', schema);
export default News;
