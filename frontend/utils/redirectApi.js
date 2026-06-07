// services/redirect.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const redirectToShortUrl = (shortCode) => {
    window.location.href = `${API_BASE_URL}/${shortCode}/`;
}

export const getRedirectUrl = (shortCode) => {
    return `${API_BASE_URL}/${shortCode}/`;
}

export const checkShortCode = async (shortCode) => {
    try {
        const response = await axios.get(`${API_BASE_URL}${shortCode}/`, {
            maxRedirects: 0,
            validateStatus: (status) => status === 302 || status === 404
        });
        
        if (response.status === 302) {
            const redirectUrl = response.headers.location;
            return { valid: true, redirectUrl };
        }
        return { valid: false, error: 'Not found' };
    } catch (error) {
        return { valid: false, error: 'Invalid short code' };
    }
}