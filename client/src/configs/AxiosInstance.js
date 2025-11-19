import axios from 'axios';
import Cookies from 'js-cookie';
import AuthService from '../services/AuthService';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
let isRefreshing = false;
let refreshSubscribers = [];

// Hàm để thêm callback vào hàng đợi
const subscribeTokenRefresh = (cb) => {
    refreshSubscribers.push(cb);
};

// Hàm để gọi tất cả callback trong hàng đợi với token mới
const onRefreshed = (token) => {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
};

const apiInstance = axios.create({
    baseURL: API_ENDPOINT,
});

apiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                // Nếu đang refresh token, thêm yêu cầu vào hàng đợi
                return new Promise((resolve) => {
                    subscribeTokenRefresh((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(apiInstance(originalRequest));
                    });
                });
            }

            isRefreshing = true;

            const _accessToken = Cookies.get('token');
            const refreshToken = Cookies.get('refresh_token');

            const response = await AuthService.refreshToken(
                _accessToken,
                refreshToken
            );

            if (!response.success) {
                // Xử lý lỗi refresh token (ví dụ: logout user)
                Cookies.remove('token');
                Cookies.remove('refresh_token');
                window.location.href = '/login';
                return Promise.reject(error);
            }

            // Gửi yêu cầu để refresh token

            const { accessToken } = response.metaData;

            // Lưu token mới vào cookies
            Cookies.set('token', accessToken);
            onRefreshed(accessToken);
            isRefreshing = false;

            // Thêm token mới vào header của yêu cầu gốc
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            window.location.reload();
            // Thử lại yêu cầu gốc
            return await apiInstance(originalRequest);
        }

        return Promise.reject(error);
    }
);

export default apiInstance;
