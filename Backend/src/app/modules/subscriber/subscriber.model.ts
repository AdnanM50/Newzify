import { model, Schema } from 'mongoose';
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

const Subscriber = model<TSubscriber>('subscriber', schema);
export default Subscriber;
