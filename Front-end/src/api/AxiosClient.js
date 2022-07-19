import axios from "axios";

const BASE_URL = "http://cd8c-58-187-175-66.ngrok.io";

const defaultConfig = {
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
};

export const AxiosInstance = axios.create(defaultConfig);

/** Appending the request headers with the comment fields */
AxiosInstance.defaults.headers.common["Content-Type"] = "application/json";
AxiosInstance.defaults.headers.common["x-dsi-restful"] = 1;