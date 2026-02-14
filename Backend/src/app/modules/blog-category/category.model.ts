import { model, Schema } from 'mongoose';
import { TBlogCategory } from './category.interface';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { slugify } from '../../utils/slugify';

const schema = new Schema<TBlogCategory>(
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

schema.pre<TBlogCategory>('save', async function (next) {
    if (this.name && (!this.slug || this.slug === '')) {
        this.slug = slugify(this.name);
    }
    next();
});

schema.post<TBlogCategory>('save', async function (doc: any, next): Promise<void> {
    doc.__v = undefined;
    next();
});

schema.plugin(aggregatePaginate);
const BlogCategory = model<TBlogCategory>('blog-category', schema);
export default BlogCategory;
