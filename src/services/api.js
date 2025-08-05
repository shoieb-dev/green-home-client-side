// api.js
const serverUrl = "https://green-home-server-side.vercel.app/api";
const localUrl = "http://localhost:5000/api";
export const API_BASE_URL = serverUrl;

export const API_ENDPOINTS = {
    houses: `${API_BASE_URL}/houses`,
    reviews: `${API_BASE_URL}/reviews`,
    users: `${API_BASE_URL}/users`,
    bookings: `${API_BASE_URL}/bookings`,
};
