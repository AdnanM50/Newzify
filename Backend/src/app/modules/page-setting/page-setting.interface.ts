import { Types } from "mongoose";

export interface IPageSetting {
  heroNews: Types.ObjectId[];
  threeBoxNews: Types.ObjectId[];
  markPlaceNews: Types.ObjectId[];
}
