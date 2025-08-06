// api.ts
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}api/v1/`;

const axiosApi = axios.create({
  baseURL: API_URL,
  validateStatus: status => status >= 200 && status < 600,
});

axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);

const updateRequest = (url: string, data: any) => {
  axiosApi.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token") ?? ""}`;
  let variables = url.match(/:[a-zA-Z]+/g);
  if (variables?.length) {
    variables.forEach(variable => {
      url = url.replace(variable, data[variable.replace(":", "")]);
      delete data[variable.replace(":", "")];
    });
  }
  return { url, data };
};

export const api = {
  get: async (url: string, data = {}, config = {}) => {
    const { url: newUrl, data: newData } = updateRequest(url, data);
    return axiosApi.get(newUrl, { ...config, params: newData }).then(res => res.data);
  },
  post: async (url: string, data = {}, config = {}) => {
    const { url: newUrl, data: newData } = updateRequest(url, data);
    axiosApi.defaults.headers.common["Content-Type"] = "application/json";
    return axiosApi.post(newUrl, newData, config).then(res => res.data);
  },
  newPost: async (url: string, data = {}, config = {}, token_name = "token") => {
    axiosApi.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(token_name) ?? ""}`;
    return axiosApi.post(url, data, config).then(res => res.data);
  },
  postForm: async (url: string, data: any, config = {}) => {
    axiosApi.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token") ?? ""}`;
    axiosApi.defaults.headers.common["Content-Type"] = "multipart/form-data";
    return axiosApi.post(url, convertToFormData(data), config).then(res => res.data);
  },
  patchForm: async (url: string, data: any, config = {}) => {
    axiosApi.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token") ?? ""}`;
    axiosApi.defaults.headers.common["Content-Type"] = "multipart/form-data";
    return axiosApi.patch(url, convertToFormData(data), config).then(res => res.data);
  },
  put: async (url: string, data: any, config = {}) => {
    const { url: newUrl, data: newData } = updateRequest(url, data);
    return axiosApi.put(newUrl, newData, config).then(res => res.data);
  },
  patch: async (url: string, data: any, config = {}) => {
    const { url: newUrl, data: newData } = updateRequest(url, data);
    axiosApi.defaults.headers.common["Content-Type"] = "application/json";
    return axiosApi.patch(newUrl, newData, config).then(res => res.data);
  },
  delete: async (url: string, data: any, config = {}) => {
    const { url: newUrl, data: newData } = updateRequest(url, data);
    return axiosApi.delete(newUrl, { ...config, params: newData }).then(res => res.data);
  },
  imgDel: async (url: string, data: any, config = {}, token_name = "token") => {
    axiosApi.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(token_name) ?? ""}`;
    if (!config.headers) config.headers = {};
    config.headers["Content-Type"] = "application/json";
    return axiosApi.delete(url, { ...config, data: { file: `${data}` } }).then(res => res.data);
  },
};

const convertToFormData = (object: Record<string, any>) => {
  const formData = new FormData();
  for (let key in object) {
    if (object[key] !== null && object[key] !== undefined) {
      if (Array.isArray(object[key])) {
        object[key].forEach(item => formData.append(key, item));
      } else {
        formData.append(key, object[key]);
      }
    }
  }
  return formData;
};
