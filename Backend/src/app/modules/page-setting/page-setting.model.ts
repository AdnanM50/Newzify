import { Schema, model } from 'mongoose';
import { IPageSetting } from './page-setting.interface';

function threeBoxLimit(val: any[]) {
  return val.length <= 3;
}

function markPlaceLimit(val: any[]) {
  return val.length <= 10;
}

const pageSettingSchema = new Schema<IPageSetting>(
  {
    heroNews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'news',
      },
    ],
    threeBoxNews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'news',
        validate: [threeBoxLimit, '{PATH} exceeds the limit of 3'],
      },
    ],
    markPlaceNews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'news',
        validate: [markPlaceLimit, '{PATH} exceeds the limit of 10'],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const PageSetting = model<IPageSetting>('PageSetting', pageSettingSchema);
