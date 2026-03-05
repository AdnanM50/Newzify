import { Schema, model } from 'mongoose';
import { IPageSetting } from './page-setting.interface';

const pageSettingSchema = new Schema<IPageSetting>(
  {
    heroNews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'News',
      },
    ],
    threeBoxNews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'News',
        validate: [arrayLimit, '{PATH} exceeds the limit of 3'],
      },
    ],
  },
  {
    timestamps: true,
  }
);

function arrayLimit(val: any[]) {
  return val.length <= 3;
}

export const PageSetting = model<IPageSetting>('PageSetting', pageSettingSchema);
