/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import "@ant-design/v5-patch-for-react-19";
import { notification } from "antd";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaRegCircleCheck, FaRegCircleXmark } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";


export const useFetch = (func, query = {}, load = true) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(load);
  const [error, setError] = useState(" ");
  const [params, setParams] = useState(query);
  useEffect(() => {
    if (load) {
      getData(params);
    }
  }, []);

  const getData = (query) => {
    setLoading(true);
    setError("");
    setParams({ ...params, ...query });
    func({ ...params, ...query })
      .then(({ success: error, data, message }) => {
        setLoading(false);
        if (error === true) {
          setData(data);
        } else {
          setData(undefined);
          setError(message);
        }
      })
      .catch((e) => {});
  };
  const clear = () => setData(undefined);
  return [data, getData, { query: params, loading, error, clear }];
};

export const useAction = async (
  func,
  data,
  reload,
  alert = true,
  successMsg
) => {
  const { success, statusCode,errorMessage, message, data: d } = await func({ ...data });

  if (success === true) {
    if (reload) {
      reload(d);
    }
    if (alert) {
      notification.success({
        message: successMsg || message || "Success",
        icon: <span className="text-3xl !text-primary"><FaRegCircleCheck  /></span>,
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
};

export const useActionConfirm = async (
  func,
  data,
  reload,
  message,
  mode,
  alert = true
) => {
  const { isConfirmed } = await Swal.fire({
    title: "Are you sure?",
    text: message,
    icon: "warning",
    showCancelButton: true,
  });
  if (isConfirmed) {
    await useAction(func, data, reload, alert);
  }
};

export const userOutSideClick = (ref, func) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        func && func();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
};