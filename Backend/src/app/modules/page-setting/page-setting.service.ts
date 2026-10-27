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

const DEFAULT_SOCIAL_LINKS = [
  { name: 'Facebook', link: 'https://facebook.com/newzify' },
  { name: 'Twitter', link: 'https://x.com/newzify' },
  { name: 'Instagram', link: 'https://instagram.com/newzify' },
  { name: 'Youtube', link: 'https://youtube.com/@newzify' },
];

const getPageSettings = async () => {
  let result: any = await PageSetting.findOne()
    .populate({
      path: 'heroNews',
      populate: { path: 'category' }
    })
    .populate({
      path: 'threeBoxNews',
      populate: { path: 'category' }
    })
    .populate({
      path: 'markPlaceNews',
      populate: { path: 'category' }
    });

  if (!result) {
    result = await PageSetting.create({
      heroNews: [],
      threeBoxNews: [],
      markPlaceNews: [],
      socialLinks: DEFAULT_SOCIAL_LINKS,
    });
  } else if (!result.socialLinks || result.socialLinks.length === 0) {
    result.socialLinks = DEFAULT_SOCIAL_LINKS;
  }

  return result;
};

export const PageSettingService = {
  updatePageSettings,
  getPageSettings,
};
