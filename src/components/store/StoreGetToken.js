import { create } from "zustand";
import apiClient from "../../utils/api";

export const getToken = create(() => ({
    refreshAccessToken: async () => {
        try {
            const token = localStorage.getItem('refreshToken');
            console.log(`refreshToken ${token}`);
            const res = await apiClient.post(`api/auth/refreshToken?refreshToken=${token}`);
            const { accessToken, refreshToken } = res.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            return accessToken;
        } catch (e) {
            console.error('Ошибка при обновлении access токена', e);
        }
    }
}))