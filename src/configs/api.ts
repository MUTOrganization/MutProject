import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { BASE_URL } from "@/config";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
    noRefresh?: boolean;
}

interface FailedRequest {
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, 
})

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: AxiosError | null) => {
    failedQueue.forEach((request) => {
        if(error) {
            request.reject(error);
        } else {
            request.resolve();
        }
    })
    failedQueue = [];
};

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        if(error.response?.status === 401 && !originalRequest._retry && !originalRequest.noRefresh) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => api(originalRequest));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try{
                await axios.post(`${BASE_URL}/auth/refreshToken`, {}, { withCredentials: true })
                processQueue(null);
                return api(originalRequest);
            } catch (error) {
                processQueue(error as AxiosError);
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default api;
