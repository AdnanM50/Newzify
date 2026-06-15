import { model, Schema } from 'mongoose';
import { TEditorial } from './editorial.interface';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new Schema<TEditorial>(
    {
        title: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            index: true,
        },
        subtitle: {
            type: String,
        },
        content: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
        category: {
            type: String,
            enum: ['editorial', 'big-picture', 'views', 'opinion', 'geopolitical-insights'],
            default: 'editorial',
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
        is_editors_pick: {
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

schema.post<TEditorial>('save', async function (doc: any, next): Promise<void> {
    doc.__v = undefined;
    next();
});

schema.plugin(aggregatePaginate);
const Editorial = model<TEditorial>('editorial', schema);
export default Editorial;
