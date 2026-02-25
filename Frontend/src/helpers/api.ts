

const BACKEND_URL = "https://newzify-backend-kappa.vercel.app";
const API_URL = `${BACKEND_URL.replace(/\/$/, "")}/api/v1/`;
// https://newzify-backend-kappa.vercel.app
// http://localhost:5000
// API Response type matching your backend
export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  errorMessage?: string;
}

interface FetchOptions extends RequestInit {
  data?: Record<string, unknown> | FormData;
  params?: Record<string, unknown>;
  token_name?: string;
}

// Helper to construct URL with query params
const buildUrl = (endpoint: string, params: Record<string, unknown> = {}) => {
  const baseUrl = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint.replace(/^\//, "")}`;
  const url = new URL(baseUrl);
  
  // Clone params to avoid mutation
  const queryParams = { ...params };

  // Handle path parameters (e.g., /users/:id)
  let finalPath = url.pathname;
  Object.keys(queryParams).forEach((key) => {
    if (finalPath.includes(`:${key}`)) {
      finalPath = finalPath.replace(`:${key}`, String(queryParams[key]));
      delete queryParams[key];
    }
  });
  url.pathname = finalPath;

  // Append remaining params as query string
  Object.keys(queryParams).forEach((key) => {
    if (queryParams[key] !== undefined && queryParams[key] !== null) {
      url.searchParams.append(key, String(queryParams[key]));
    }
  });

  return url.toString();
};

// Generic Fetch Wrapper
const customFetch = async <T>(endpoint: string, options: FetchOptions = {}): Promise<ApiResponse<T>> => {
  const { data, params = {}, token_name = "token", headers = {}, ...customConfig } = options;
  
  const url = buildUrl(endpoint, params);
  
  const config: RequestInit = {
    ...customConfig,
    headers: {
      Authorization: `Bearer ${localStorage.getItem(token_name) ?? ""}`,
      ...headers,
    },
  };

  if (data) {
    if (data instanceof FormData) {
      // Let browser set Content-Type for FormData
      config.body = data;
    } else {
      config.body = JSON.stringify(data);
      config.headers = {
        ...config.headers,
        "Content-Type": "application/json",
      };
    }
  }

  try {
    const response = await fetch(url, config);
    const result: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw {
        message: result.message || "Something went wrong",
        errorMessage: result.errorMessage,
        statusCode: response.status,
      };
    }

    return result;
  } catch (error: any) {
    throw {
      message: error.message || "Network Error",
      errorMessage: error.errorMessage || error.message,
      statusCode: error.statusCode || 500,
    };
  }
};

// Convert object to FormData for file uploads
const convertToFormData = (object: Record<string, unknown>) => {
  const formData = new FormData();
  for (const key in object) {
    if (object[key] !== null && object[key] !== undefined) {
      if (Array.isArray(object[key])) {
        (object[key] as unknown[]).forEach((item) =>
          formData.append(key, item as string | Blob)
        );
      } else {
        formData.append(key, object[key] as string | Blob);
      }
    }
  }
  return formData;
};

// API methods object
export const api = {
  get: <T = unknown>(url: string, params: Record<string, unknown> = {}) =>
    customFetch<T>(url, { method: "GET", params }),

  post: <T = unknown>(url: string, data: Record<string, unknown> = {}) =>
    customFetch<T>(url, { method: "POST", data }),

  postForm: <T = unknown>(url: string, data: Record<string, unknown>) =>
    customFetch<T>(url, { method: "POST", data: convertToFormData(data) }),

  put: <T = unknown>(url: string, data: Record<string, unknown> = {}) =>
    customFetch<T>(url, { method: "PUT", data }),

  patch: <T = unknown>(url: string, data: Record<string, unknown> = {}) =>
    customFetch<T>(url, { method: "PATCH", data }),

  patchForm: <T = unknown>(url: string, data: Record<string, unknown>) =>
    customFetch<T>(url, { method: "PATCH", data: convertToFormData(data) }),

  delete: <T = unknown>(url: string, data: Record<string, unknown> = {}) =>
    customFetch<T>(url, { method: "DELETE", data }), // Send data as body for DELETE
};

// User Profile API Functions
export const userProfileApi = {
  getLikedPosts: (params: { page?: number; limit?: number } = {}) =>
    api.get('/user/profile/liked-posts', params),
  
  getUserComments: (params: { page?: number; limit?: number } = {}) =>
    api.get('/user/profile/comments', params),
  
  getUserReplies: (params: { page?: number; limit?: number } = {}) =>
    api.get('/user/profile/replies', params),
  
  toggleNewsLike: (newsId: string) =>
    api.patch(`/user/profile/toggle-like/${newsId}`),
  
  updateUserProfile: (data: Record<string, unknown>) =>
    api.patch('/user/update', data),
};

export default api;

