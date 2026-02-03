// backend.ts - Backend API endpoint creator
import { api, type ApiResponse } from "./api";

// HTTP methods type
type HttpMethod = "get" | "post" | "put" | "patch" | "delete" | "postForm" | "patchForm";

export type TCategory = {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
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
  cover_image?: string;
  category?: TCategory | string;
  types?: Array<'trending' | 'latest' | 'popular' | 'fresh' | 'top'>;
  author?: any;
  status?: 'draft' | 'published';
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

// ==================== Category Endpoints ====================

// Get all categories
// GET /category/list
export const getCategories = backend<PaginatedResponse<TCategory>>("/category/list", "get");

// Create category
// POST /category/create
export const createCategory = backend<TCategory>("/category/create", "post");

// Update category
// PUT /category/update
export const updateCategory = backend<TCategory>("/category/update", "put");

// Delete category
// DELETE /category/delete
export const deleteCategory = backend<null>("/category/delete", "delete");

// ==================== News Endpoints ====================

// Get list of news
// GET /news/list
export const getNewsList = backend<PaginatedResponse<TNews>>("/news/list", "get");

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

// Upload single image
// POST /files/single-image-upload (expects FormData with 'file' field)
// Upload single image
// POST /files/single-image-upload (expects FormData with 'file' field)
export const uploadImage = backend<{ url: string }>("/files/single-image-upload", "postForm");

// Delete single image
// DELETE /files/delete (expects JSON with 'public_id')
export const deleteImage = backend<{ message: string }>("/files/delete", "delete");


export default backend;
