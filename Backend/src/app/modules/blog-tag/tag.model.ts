import { model, Schema } from 'mongoose';
import { TTag } from './tag.interface';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { slugify } from '../../utils/slugify';

const schema = new Schema<TTag>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
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

schema.pre<TTag>('save', async function (next) {
    if (this.name && (!this.slug || this.slug === '')) {
        this.slug = slugify(this.name);
    }
    next();
});

schema.post<TTag>('save', async function (doc: any, next): Promise<void> {
    doc.__v = undefined;
    next();
});

schema.plugin(aggregatePaginate);
const Tag = model<TTag>('tag', schema);
export default Tag;
