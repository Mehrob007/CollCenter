// src/store/useAuthStore.js
import create from 'zustand';
import axios from 'axios';

export const useAuthStore = create((set) => ({
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    
    setAccessToken: (token) => {
        localStorage.setItem('accessToken', token);
        set({ accessToken: token });
    },
    
    setRefreshToken: (token) => {
        localStorage.setItem('refreshToken', token);
        set({ refreshToken: token });
    },

    refreshAccessToken: async () => {
        try {
            const response = await axios.post('/api/refresh-token', {
                refreshToken: localStorage.getItem('refreshToken'),
            });
            const newAccessToken = response.data.accessToken;
            const newRefreshToken = response.data.refreshToken;

            set({ accessToken: newAccessToken, refreshToken: newRefreshToken });
            localStorage.setItem('accessToken', newAccessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            return newAccessToken;
        } catch (error) {
            console.error('Failed to refresh access token:', error);
            return null;
        }
    },
}));

 

export const useAuthStoreOperator = create((set) => ({
    dataOperator: [],
    sendDataOperator: (data) => {
        set({ dataOperator: data })
    },
}));
