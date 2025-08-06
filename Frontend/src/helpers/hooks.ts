// hooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import Swal from "sweetalert2";
import { FaRegCircleCheck, FaRegCircleXmark } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

// ⚡ FETCH HOOK
export const useFetch = (key, func, params = {}, enabled = true) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [key, params],
    queryFn: () => func(params),
    enabled,
  });

  const clear = () => refetch();

  return [data, refetch, { query: params, loading: isLoading, error, clear }];
};

// ⚡ ACTION HOOK (MUTATION)
export const useAction = ({ func, onSuccess, successMsg = "", alert = true }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: func,
    onSuccess: (res) => {
      const { success, message, errorMessage, data } = res;

      if (success) {
        if (onSuccess) onSuccess(data);
        if (alert) {
          notification.success({
            message: successMsg || message || "Success",
            icon: <span className="text-3xl !text-primary"><FaRegCircleCheck /></span>,
            closeIcon: <IoClose className="text-2xl !text-[#1c1c1c]" />,
          });
        }
      } else {
        notification.error({
          message: errorMessage || "Something went wrong",
          icon: <span className="text-3xl !text-red-600"><FaRegCircleXmark /></span>,
          closeIcon: <IoClose className="text-2xl !text-[#1c1c1c]" />,
        });
      }
    },
    onError: (err) => {
      notification.error({
        message: "Something went wrong",
      });
    }
  });
};

// ⚡ ACTION CONFIRM HOOK
export const useActionConfirm = async ({ func, data, reload, message, alert = true }) => {
  const { isConfirmed } = await Swal.fire({
    title: "Are you sure?",
    text: message,
    icon: "warning",
    showCancelButton: true,
  });

  if (isConfirmed) {
    await useAction({ func, onSuccess: reload, alert }).mutateAsync(data);
  }
};
