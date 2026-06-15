import { model, Schema } from 'mongoose';
import { TPodcast } from './podcast.interface';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new Schema<TPodcast>(
    {
        title: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            index: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
        embed_code: {
            type: String,
        },
        audio_url: {
            type: String,
        },
        category: {
            type: String,
            enum: ['in-focus', 'the-rearview', 'daily-news', 'interviews', 'specials'],
            default: 'in-focus',
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
        is_featured: {
            type: Boolean,
            default: false,
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

schema.post<TPodcast>('save', async function (doc: any, next): Promise<void> {
    doc.__v = undefined;
    next();
});

schema.plugin(aggregatePaginate);
const Podcast = model<TPodcast>('podcast', schema);
export default Podcast;
