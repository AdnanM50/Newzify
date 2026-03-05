import { IPageSetting } from './page-setting.interface';
import { PageSetting } from './page-setting.model';

const updatePageSettings = async (payload: IPageSetting) => {
  const existingSetting = await PageSetting.findOne();

  if (!existingSetting) {
    const newSetting = await PageSetting.create(payload);
    return newSetting;
  }

  const updatedSetting = await PageSetting.findOneAndUpdate({}, payload, {
    new: true,
  });

  return updatedSetting;
};

const getPageSettings = async () => {
  const result = await PageSetting.findOne()
    .populate('heroNews')
    .populate('threeBoxNews');
  return result;
};

export const PageSettingService = {
  updatePageSettings,
  getPageSettings,
};
