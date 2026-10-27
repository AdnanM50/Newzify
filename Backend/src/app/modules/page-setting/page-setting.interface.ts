import { Types } from "mongoose";

export interface ISocialLink {
  name: string;
  link: string;
}

export interface IPageSetting {
  heroNews: Types.ObjectId[];
  threeBoxNews: Types.ObjectId[];
  markPlaceNews: Types.ObjectId[];
  socialLinks?: ISocialLink[];
}
