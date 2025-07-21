import {Router} from "express";
import userRouter from "../modules/user/user.route";
// import authRouter from "../modules/auth/auth.route";
import { otpRoutes } from "../modules/otp/otp.route";
// import { settingRoutes } from "../modules/setting/setting.route";
// import { fileRouters } from "../modules/file/file.route";
// import { faqRoutes } from "../modules/faq/faq.route";
// import {ProductCategoryRoute} from "../modules/product/product-category/product-category.route";
// import {languageRoutes} from "../modules/setting-language/setting-language.route";
// import {pageRoutes} from "../modules/setting-page/setting-page.route";
// import {blogRoutes} from "../modules/blog/blog.route";
// import {blogCategoryRoutes} from "../modules/blog-category/blog-category.route";
// import {tagRoutes} from "../modules/blog-tag/blog-tag.route";
// import {ProductSectionRouter} from "../modules/product/product-section/product-section.routes";
// import {ProductBrandRouter} from "../modules/product/product-brand/product-brand.routes";
// import {ProductAttributeRouter} from "../modules/product/product-attributes/product-attributes.routes";
// import {ProductRouter} from "../modules/product/product.routes";
// import {HeroBannerRoute} from "../modules/hero-banner/hero-banner.routes";
// import {ProductCouponRouter} from "../modules/product/product-coupon/coupon.routes";
// import {contactRoutes} from "../modules/contact/contact.route";
// import {subscriberRoutes} from "../modules/subscriber/subscriber.route";

const router = Router();

const moduleRouters:any = [
    {
        path: '/user',
        route: userRouter,
    },
    // {
    //     path: '/auth',
    //     route: authRouter,
    // },
    {
        path: '/otp',
        route: otpRoutes,
    },
    // {
    //     path: '/files',
    //     route: fileRouters,
    // },
    // {
    //     path: '/setting',
    //     route: settingRoutes,
    // },
    // {
    //     path: '/settings/languages',
    //     route: languageRoutes,
    // },
    // {
    //     path: '/settings/pages',
    //     route: pageRoutes,
    // },
    // {
    //     path: '/contact',
    //     route: contactRoutes,
    // },
    // {
    //     path: '/subscriber',
    //     route: subscriberRoutes,
    // },
    // {
    //     path: '/blogs',
    //     route: blogRoutes,
    // },
    // {
    //     path: '/blog-categories',
    //     route: blogCategoryRoutes,
    // },
    // {
    //     path: '/blog-tags',
    //     route: tagRoutes,
    // },
    // {
    //     path: '/faq',
    //     route: faqRoutes,
    // },
    // {
    //     path: '/product-category',
    //     route: ProductCategoryRoute,
    // },
    // {
    //     path: '/product-section',
    //     route: ProductSectionRouter,
    // },
    // {
    //     path: '/product-brand',
    //     route: ProductBrandRouter,
    // },
    // {
    //     path: '/product-attribute',
    //     route: ProductAttributeRouter,
    // },
    // {
    //     path: '/product',
    //     route: ProductRouter,
    // },
    // {
    //     path: '/product-coupon',
    //     route: ProductCouponRouter,
    // },
    // {
    //     path: '/banner',
    //     route: HeroBannerRoute,
    // },
]
moduleRouters.forEach((route: any) => router.use(route.path, route.route));
export default router;