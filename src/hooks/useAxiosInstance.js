// useAxiosInstance.js
import axios from "axios";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { API_BASE_URL } from "../services/api";

const instance = axios.create({
    baseURL: API_BASE_URL,
});

export const useAxiosInstance = () => {
    useEffect(() => {
        const auth = getAuth();

        // Set up interceptor once
        const interceptor = instance.interceptors.request.use(
            async (config) => {
                const user = auth.currentUser;
                if (user) {
                    const token = await user.getIdToken();
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Optional cleanup if component unmounts
        return () => {
            instance.interceptors.request.eject(interceptor);
        };
    }, []);

    return { axiosInstance: instance };
};
