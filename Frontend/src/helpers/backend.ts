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


export default backend;
