import { create } from "zustand";
import apiClient from "../../utils/api";

export const getToken = create((set, get) => ({
    refreshAccessToken: async () => {
        localStorage.removeItem('accessToken')
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            const res = await apiClient.post(`api/auth/refreshToken?refreshToken=${refreshToken}`);
            const { accessToken } = res.data;
            console.log(accessToken);
            localStorage.setItem('accessToken', accessToken);
            return accessToken;
        } catch (e) {
            console.error('Ошибка при обновлении access токена', e);
        }
    }
}))