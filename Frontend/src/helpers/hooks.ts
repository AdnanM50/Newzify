// hooks.ts - TanStack Query hooks with react-hot-toast integration
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
  type QueryKey,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { type ApiResponse } from "./api";

// ==================== FETCH HOOK (GET operations) ====================
/**
 * Hook for fetching data (GET requests)
 * - No toast on success (silent success)
 * - Shows error toast on failure with message from API
 * 
 * @param key - Unique query key for caching
 * @param func - API function that returns a Promise<ApiResponse<T>>
 * @param params - Optional parameters to pass to the API function
 * @param options - Optional TanStack Query options
 * 
 * @example
 * const { data, isLoading, error, refetch } = useFetch(
 *   "users",
 *   getUsers,
 *   { page: 1, limit: 10 }
 * );
 */
export const useFetch = <T = unknown>(
  key: string | string[],
  func: (params: Record<string, unknown>) => Promise<ApiResponse<T>>,
  params: Record<string, unknown> = {},
  options?: Omit<UseQueryOptions<ApiResponse<T>, Error>, "queryKey" | "queryFn">
) => {
  const queryKey: QueryKey = Array.isArray(key) ? [...key, params] : [key, params];

  const query = useQuery<ApiResponse<T>, Error>({
    queryKey,
    queryFn: async () => {
      const response = await func(params);
      
      // Check if API response indicates failure
      if (!response.success) {
        const errorMsg = response.errorMessage || response.message || "Something went wrong";
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }
      
      return response;
    },
    ...options,
  });

  return {
    data: query.data?.data,
    response: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isSuccess: query.isSuccess,
    status: query.status,
  };
};

// ==================== ACTION HOOK (POST, PUT, PATCH operations) ====================
/**
 * Hook for mutations (POST, PUT, PATCH requests)
 * - Shows success toast on success with message from API
 * - Shows error toast on failure with message from API
 * 
 * @param func - API function that returns a Promise<ApiResponse<T>>
 * @param options - Configuration options
 * 
 * @example
 * const { mutate, isLoading } = useAction(createUser, {
 *   onSuccess: (data) => navigate("/users"),
 *   invalidateKeys: ["users"],
 * });
 * 
 * // Then call:
 * mutate({ name: "John", email: "john@example.com" });
 */
interface UseActionOptions<T = unknown> {
  onSuccess?: (data: T, response: ApiResponse<T>) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  invalidateKeys?: string[];
  mutationOptions?: Omit<UseMutationOptions<ApiResponse<T>, Error, Record<string, unknown>>, "mutationFn">;
}

export const useAction = <T = unknown>(
  func: (data: Record<string, unknown>) => Promise<ApiResponse<T>>,
  options: UseActionOptions<T> = {}
) => {
  const queryClient = useQueryClient();
  const {
    onSuccess,
    onError,
    successMessage,
    showSuccessToast = true,
    showErrorToast = true,
    invalidateKeys = [],
    mutationOptions,
  } = options;

  return useMutation<ApiResponse<T>, Error, Record<string, unknown>>({
    mutationFn: func,
    onSuccess: (response) => {
      if (response.success) {
        // Show success toast
        if (showSuccessToast) {
          toast.success(successMessage || response.message || "Operation successful");
        }
        
        // Invalidate specified query keys
        invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
        
        // Call custom onSuccess callback
        if (onSuccess) {
          onSuccess(response.data, response);
        }
      } else {
        // API returned success: false
        const errorMsg = response.errorMessage || response.message || "Something went wrong";
        if (showErrorToast) {
          toast.error(errorMsg);
        }
        if (onError) {
          onError(new Error(errorMsg));
        }
      }
    },
    onError: (error) => {
      if (showErrorToast) {
        toast.error(error.message || "Something went wrong");
      }
      if (onError) {
        onError(error);
      }
    },
    ...mutationOptions,
  });
};

// ==================== DELETE HOOK ====================
/**
 * Hook specifically for DELETE operations
 * - Shows success toast on successful deletion
 * - Shows error toast on failure with message from API
 * 
 * @param func - API delete function
 * @param options - Configuration options
 * 
 * @example
 * const { mutate: deleteItem, isLoading } = useDelete(deleteUser, {
 *   invalidateKeys: ["users"],
 *   onSuccess: () => console.log("User deleted"),
 * });
 * 
 * // Then call:
 * deleteItem({ id: "123" });
 */
interface UseDeleteOptions<T = unknown> {
  onSuccess?: (data: T, response: ApiResponse<T>) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  invalidateKeys?: string[];
  mutationOptions?: Omit<UseMutationOptions<ApiResponse<T>, Error, Record<string, unknown>>, "mutationFn">;
}

export const useDelete = <T = unknown>(
  func: (data: Record<string, unknown>) => Promise<ApiResponse<T>>,
  options: UseDeleteOptions<T> = {}
) => {
  const queryClient = useQueryClient();
  const {
    onSuccess,
    onError,
    successMessage = "Deleted successfully",
    showSuccessToast = true,
    showErrorToast = true,
    invalidateKeys = [],
    mutationOptions,
  } = options;

  return useMutation<ApiResponse<T>, Error, Record<string, unknown>>({
    mutationFn: func,
    onSuccess: (response) => {
      if (response.success) {
        // Show success toast
        if (showSuccessToast) {
          toast.success(successMessage || response.message);
        }
        
        // Invalidate specified query keys
        invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
        
        // Call custom onSuccess callback
        if (onSuccess) {
          onSuccess(response.data, response);
        }
      } else {
        // API returned success: false
        const errorMsg = response.errorMessage || response.message || "Delete failed";
        if (showErrorToast) {
          toast.error(errorMsg);
        }
        if (onError) {
          onError(new Error(errorMsg));
        }
      }
    },
    onError: (error) => {
      if (showErrorToast) {
        toast.error(error.message || "Delete failed");
      }
      if (onError) {
        onError(error);
      }
    },
    ...mutationOptions,
  });
};

// ==================== PREFETCH HOOK ====================
/**
 * Hook to prefetch data for better UX
 * 
 * @example
 * const { prefetch } = usePrefetch("user", getUser);
 * 
 * // Prefetch on hover
 * <button onMouseEnter={() => prefetch({ id: "123" })}>
 *   View User
 * </button>
 */
export const usePrefetch = <T = unknown>(
  key: string,
  func: (params: Record<string, unknown>) => Promise<ApiResponse<T>>
) => {
  const queryClient = useQueryClient();

  const prefetch = (params: Record<string, unknown> = {}) => {
    queryClient.prefetchQuery({
      queryKey: [key, params],
      queryFn: () => func(params),
    });
  };

  return { prefetch };
};

// ==================== OPTIMISTIC UPDATE HOOK ====================
/**
 * Hook for mutations with optimistic updates
 * Immediately updates the UI before the server responds
 * 
 * @example
 * const { mutate } = useOptimisticAction(
 *   updateUser,
 *   "users",
 *   (oldData, newData) => ({
 *     ...oldData,
 *     users: oldData.users.map(u => 
 *       u.id === newData.id ? { ...u, ...newData } : u
 *     )
 *   })
 * );
 */
export const useOptimisticAction = <T = unknown, TContext = unknown>(
  func: (data: Record<string, unknown>) => Promise<ApiResponse<T>>,
  queryKey: string,
  updateFn: (oldData: TContext, newData: Record<string, unknown>) => TContext,
  options: UseActionOptions<T> = {}
) => {
  const queryClient = useQueryClient();
  const {
    onSuccess,
    onError,
    successMessage,
    showSuccessToast = true,
    showErrorToast = true,
  } = options;

  return useMutation<ApiResponse<T>, Error, Record<string, unknown>, { previousData: TContext | undefined }>({
    mutationFn: func,
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: [queryKey] });
      
      // Snapshot current value
      const previousData = queryClient.getQueryData<TContext>([queryKey]);
      
      // Optimistically update
      if (previousData) {
        queryClient.setQueryData([queryKey], updateFn(previousData, newData));
      }
      
      return { previousData };
    },
    onSuccess: (response) => {
      if (response.success) {
        if (showSuccessToast) {
          toast.success(successMessage || response.message || "Updated successfully");
        }
        if (onSuccess) {
          onSuccess(response.data, response);
        }
      } else {
        const errorMsg = response.errorMessage || response.message || "Update failed";
        if (showErrorToast) {
          toast.error(errorMsg);
        }
        // Rollback on API failure
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      }
    },
    onError: (error, _newData, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData([queryKey], context.previousData);
      }
      if (showErrorToast) {
        toast.error(error.message || "Update failed");
      }
      if (onError) {
        onError(error);
      }
    },
    onSettled: () => {
      // Refetch after mutation settles
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};

// ==================== INFINITE QUERY HOOK ====================
/**
 * Hook for infinite scrolling / load more functionality
 * 
 * @example
 * const {
 *   data,
 *   fetchNextPage,
 *   hasNextPage,
 *   isFetchingNextPage,
 * } = useInfiniteFetch("news", getNews, { limit: 10 });
 */
import { useInfiniteQuery, type QueryFunctionContext } from "@tanstack/react-query";

interface PaginatedData<T> {
  items: T[];
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export const useInfiniteFetch = <T = unknown>(
  key: string,
  func: (params: Record<string, unknown>) => Promise<ApiResponse<PaginatedData<T>>>,
  params: Record<string, unknown> = {},
  options?: {
    enabled?: boolean;
  }
) => {
  const query = useInfiniteQuery<ApiResponse<PaginatedData<T>>, Error>({
    queryKey: [key, params],
    queryFn: async ({ pageParam = 1 }: QueryFunctionContext) => {
      const response = await func({ ...params, page: pageParam });
      
      if (!response.success) {
        const errorMsg = response.errorMessage || response.message || "Failed to fetch";
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }
      
      return response;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.data?.hasMore) {
        return (lastPage.data?.page || 0) + 1;
      }
      return undefined;
    },
    enabled: options?.enabled ?? true,
  });

  // Flatten all pages data
  const allData = query.data?.pages.flatMap((page) => page.data?.items || []) || [];

  return {
    data: allData,
    pages: query.data?.pages,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

export default {
  useFetch,
  useAction,
  useDelete,
  usePrefetch,
  useOptimisticAction,
  useInfiniteFetch,
};
