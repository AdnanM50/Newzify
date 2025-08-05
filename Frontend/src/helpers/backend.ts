import { del, get, patch, post, postForm, patchForm, put, imgDel, newPost } from "./api";

// Define types for better type safety
interface RequestData {
  [key: string]: any;
  _id?: string;
}

export const sendOtp = (data: RequestData) => post("/otp/send", data);
export const postRegister = (data: RequestData) => post("/user/register", data);
export const postLogin = (data: RequestData) => post("/auth/login", data);
export const postVerifyOtp = (data: RequestData) => post("/auth/forget-password/verify-otp", data);
export const postResetPassword = (data: RequestData) => post("/auth/forget-password/submit", data);

export const fetchUser = (data: RequestData) => get("/user/profile", data);
export const updateUser = (data: RequestData) => patch("/user/update", data);
export const updatePassword = (data: RequestData) => put("/update-password", data);
export const changedPassword = (data: RequestData) => patch("/auth/password-update", data);

// admin users
export const fetchUsers = (data: RequestData) => get("/user/list?role=user", data);
export const fetchVendor = (data: RequestData) => get("/user/list?role=vendor", data);

// admin settings
export const fetchSettings = (data: RequestData) => get("/setting", data);
export const postSettings = (data: RequestData) => post("/setting", data);
export const fetchEmailSettings = (data: RequestData) => get("/setting?fields=email_config", data);
export const postEmailSettings = (data: RequestData) => post("/setting", data);
export const fetchSMSSettings = (data: RequestData) => get("/setting?fields=phone_config", data);
export const postsSMSSettings = (data: RequestData) => post("/setting", data);
export const fetchsiteSettings = (data: RequestData) => get("/setting/site", data);

//translation
export const fetchTranslations = (data: RequestData) => get("/settings/languages/site", data);
export const fetchAllLanguages = (data: RequestData) => get("/settings/languages/site", data);
export const fetchAdminLanguages = (data: RequestData) => get("/settings/languages", data);
export const putLanguage = (data: RequestData) => put("/settings/languages", data);
export const postLanguage = (data: RequestData) => post("/settings/languages", data);
export const delLanguage = (data: RequestData) => del(`/settings/languages/${data._id}`, {});

// file upload
export const deleteFile = (data: string) => imgDel("/files/file-remove", data);
export const uploadSingleFile = (data: RequestData) => postForm("/files/single-image-upload", data);
export const uploadMultipleFile = (data: RequestData) => postForm("/files/multiple-image-upload", data);

// admin faq
export const fetchFAQ = (data: RequestData) => get("/faq", data);
export const deleteFAQ = (data: RequestData) => del(`/faq/${data._id}`, {});
export const postFAQ = (data: RequestData) => post(`/faq`, data);
export const updatedFAQ = (data: RequestData) => put(`/faq`, data);

// admin product category
export const fetchCategory = (data: RequestData) => get("/product-category", data);
export const createCategory = (data: RequestData) => post("/product-category/create", data);
export const updateCategory = (data: RequestData) => patch("/product-category", data);
export const deleteCategory = (data: RequestData) => del(`/product-category/${data._id}`, {});

// admin product brand
export const fetchBrand = (data: RequestData) => get("/product-brand", data);
export const createBrand = (data: RequestData) => post("/product-brand", data);
export const updateBrand = (data: RequestData) => patch("/product-brand", data);
export const deleteBrand = (data: RequestData) => del(`/product-brand/${data._id}`, {});

// admin product Sections
export const fetchsection = (data: RequestData) => get("/product-section", data);
export const createsection = (data: RequestData) => post("/product-section", data);
export const updatesection = (data: RequestData) => patch("/product-section", data);
export const deletesection = (data: RequestData) => del(`/product-section/${data._id}`, {});

// admin product attribute
export const fetchAttribute = (data: RequestData) => get("/product-attribute", data);
export const createAttribute = (data: RequestData) => post("/product-attribute", data);
export const updateAttribute = (data: RequestData) => patch("/product-attribute", data);
export const deleteAttribute = (data: RequestData) => del(`/product-attribute/${data._id}`, {});

// admin Coupons
export const fetchCoupons = (data: RequestData) => get("/product-coupon", data);
export const createCoupons = (data: RequestData) => post("/product-coupon", data);
export const updateCoupons = (data: RequestData) => patch("/product-coupon", data);
export const deleteCoupons = (data: RequestData) => del(`/product-coupon/${data._id}`, {});

// admin product 
export const fetchVendorProduct = (data: RequestData) => get("/product?type=vendor&all=yes", data);
export const fetchProduct = (data: RequestData) => get("/product", data);
export const singleProductAdmin = (data: RequestData) => get("/product", data);
export const createProduct = (data: RequestData) => post("/product", data);
export const updateProduct = (data: RequestData) => patch("/product", data);
export const deleteProduct = (data: RequestData) => del(`/product/${data._id}`, {});
export const allVendorProducts = (data: RequestData) => get("/product?type=vendor&all=yes", data);

// admin Blog Category
export const fetchBlogCategory = (data: RequestData) => get("/blog-categories", data);
export const createBlogCategory = (data: RequestData) => post("/blog-categories", data);
export const updateBlogCategory = (data: RequestData) => patch("/blog-categories", data);
export const deleteBlogCategory = (data: RequestData) => del(`/blog-categories/${data._id}`, {});

// admin Blog tag
export const fetchBlogTag = (data: RequestData) => get("/blog-tags", data);
export const createBlogTag = (data: RequestData) => post("/blog-tags", data);
export const updateBlogTag = (data: RequestData) => patch("/blog-tags", data);
export const deleteBlogTag = (data: RequestData) => del(`/blog-tags/${data._id}`, {});

// admin blog
export const fetchBlog = (data: RequestData) => get("/blogs", data);
export const createBlog = (data: RequestData) => post("/blogs", data);
export const updateBlog = (data: RequestData) => patch("/blogs", data);
export const deleteBlog = (data: RequestData) => del(`/blogs/${data._id}`, {});

// admin Banner
export const fetchBanner = (data: RequestData) => get("/banner", data);
export const createBanner = (data: RequestData) => post("/banner", data);
export const updateBanner = (data: RequestData) => patch("/banner", data);    
export const deleteBanner = (data: RequestData) => del(`/banner/${data._id}`, {});
export const fetchpublicBanner = (data: RequestData) => get("/banner/public?status=true", data);

// public Sections
export const fetchpublicSection = (data: RequestData) => get("/product/section/home", data);

// public products
export const fetchpublicProducts = (data: RequestData) => get("/product/site", data);

// contact us
export const contactus = (data: RequestData) => post("/contact/send", data);
export const fetchContact = (data: RequestData) => get("/contact", data);
export const replyContact = (data: RequestData) => post("/contact/send-email", data);
export const deleteContact = (data: RequestData) => del(`/contact/${data._id}`, {});

// subscribe
export const fetchSubscribe = (data: RequestData) => get("/subscriber", data);
export const createSubscribe = (data: RequestData) => post("/subscriber", data);
export const deleteSubscribe = (data: RequestData) => del(`/subscriber/${data._id}`, {});