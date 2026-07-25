import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TSubscriber } from './subscriber.interface';

const schema = new Schema<TSubscriber>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        is_active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

schema.plugin(aggregatePaginate);

const Subscriber = model<TSubscriber>('subscriber', schema);
export default Subscriber;
