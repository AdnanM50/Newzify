import { model, Schema } from 'mongoose';
import { TTag } from './blog-tag.interface';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new Schema<TTag>(
    {
        name: {
            type: Schema.Types.Map,
            unique: [true, 'Tag name is already exists'],
            of: String,
        },
        is_deleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);
schema.plugin(aggregatePaginate);
const Tag = model<TTag, any>('blog_tag', schema);
export default Tag;
