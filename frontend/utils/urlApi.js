
import { api } from '@/api';

export const createURL = async (longUrl) => {
    const response = await api.post('user/url/', { long_url: longUrl });
    return response.data;
}

export const getAllURLs = async () => {
    const response = await api.get('user/urls/');
    return response.data;
}

export const getURL = async (shortCode) => {
    const response = await api.get(`user/url/${shortCode}/`);
    return response.data;
}

export const updateURL = async (shortCode, longUrl) => {
    const response = await api.patch(`/user/url/${shortCode}/`, {
        long_url: longUrl
    });
    return response.data;
}

export const toggleURLStatus = async (shortCode, isActive) => {
    const response = await api.patch(`user/url/${shortCode}/`, {
        is_active: isActive
    });
    return response.data;
}

export const deleteURL = async (shortCode) => {
    const response = await api.delete(`user/url/${shortCode}/`);
    return response.data;
}