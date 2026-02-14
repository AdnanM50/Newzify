// backend.ts - Backend API endpoint creator
import { api, type ApiResponse } from "./api";

// HTTP methods type
type HttpMethod = "get" | "post" | "put" | "patch" | "delete" | "postForm" | "patchForm";

export type TCategory = {
  _id: string;
  name: string;
  slug?: string;
  is_deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type TNews = {
  _id: string;
  title: string;
  slug?: string;
  content: string;
  image?: string;
  category?: TCategory | string;
  types?: string[];
  author?: any;
  status?: 'draft' | 'published';
  is_deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type TBlogCategory = {
  _id: string;
  name: string;
  slug?: string;
  is_deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type TTag = {
  _id: string;
  name: string;
  slug?: string;
  is_deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type TBlog = {
  _id: string;
  title: string;
  description: string;
  image?: string;
  category: TBlogCategory | string;
  tags: Array<TTag | string>;
  slug?: string;
  is_deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type PaginatedResponse<T> = {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
  pagingCounter: number;
};

/**
 * Creates an API function for a specific endpoint and HTTP method
 */
export const backend = <T = unknown>(endpoint: string, method: HttpMethod) => {
  return (data: Record<string, unknown> = {}): Promise<ApiResponse<T>> => {
    return api[method]<T>(endpoint, data);
  };
};

// ==================== News Category Endpoints ====================

// Get all categories
// GET /category/list
export const getCategories = backend<PaginatedResponse<TCategory>>("/news-category/list", "get");

// Create category
// POST /category/create
export const createCategory = backend<TCategory>("/news-category/create", "post");

// Update category
// PUT /category/update
export const updateCategory = backend<TCategory>("/news-category/update", "put");

// Delete category
// DELETE /category/delete
export const deleteCategory = backend<null>("/news-category/delete", "delete");

// Public category list
export const getPublicCategories = backend<PaginatedResponse<TCategory>>("/news-category/public/list", "get");

// Get category by slug
export const getCategoryBySlug = backend<TCategory>("/news-category/public/:slug", "get");

// ==================== Blog Category Endpoints ====================

export const getBlogCategories = backend<PaginatedResponse<TBlogCategory>>("/blog-categories/list", "get");
export const createBlogCategory = backend<TBlogCategory>("/blog-categories/create", "post");
export const updateBlogCategory = backend<TBlogCategory>("/blog-categories/update", "put");
export const deleteBlogCategory = backend<null>("/blog-categories/delete", "delete");

// ==================== Blog Tag Endpoints ====================

export const getBlogTags = backend<PaginatedResponse<TTag>>("/blog-tags/list", "get");
export const createBlogTag = backend<TTag>("/blog-tags/create", "post");
export const updateBlogTag = backend<TTag>("/blog-tags/update", "put");
export const deleteBlogTag = backend<null>("/blog-tags/delete", "delete");

// ==================== Blog Endpoints ====================

export const getBlogs = backend<PaginatedResponse<TBlog>>("/blogs/list", "get");
export const createBlog = backend<TBlog>("/blogs/create", "post");
export const updateBlog = backend<TBlog>("/blogs/update", "put");
export const deleteBlog = backend<null>("/blogs/delete", "delete");

// ==================== News Endpoints ====================

// Get list of news
// GET /news/list
export const getNewsList = backend<PaginatedResponse<TNews>>("/news/list", "get");

// Public list of news
export const getPublicNewsList = backend<PaginatedResponse<TNews>>("/news/public/list", "get");

// Public single news
export const getPublicNewsById = backend<TNews>("/news/public/:id", "get");

// Create news
// POST /news/create
export const createNews = backend<TNews>("/news/create", "post");

// Update news
// PUT /news/update
export const updateNews = backend<TNews>("/news/update", "put");

// Delete news
// DELETE /news/delete
export const deleteNews = backend<null>("/news/delete", "delete");

// ==================== File Endpoints ====================

export const uploadImage = backend<{ url: string }>("/files/single-image-upload", "postForm");

export const deleteImage = backend<{ message: string }>("/files/delete", "delete");

// ==================== User Endpoints ====================

// Get user profile
// GET /user/profile
export const fetchUser = backend<any>("/user/profile", "get");

// Update user profile
// PATCH /user/update
export const updateProfile = backend<any>("/user/update", "patch");

// Update user password
// PATCH /auth/password-update
export const updatePassword = backend<any>("/auth/password-update", "patch");

// Admin only user management
export const fetchUserList = backend<any>("/user/list", "get");
export const createReporter = backend<any>("/user/create-reporter", "post");
export const deleteUser = backend<any>("/user/delete", "delete");
export const resetUserPassword = backend<any>("/user/reset-password", "patch");

export default backend;
