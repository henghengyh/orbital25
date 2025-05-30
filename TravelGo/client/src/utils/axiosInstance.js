import axios from 'axios';
import { API_URL } from './constants';

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000, // Set a timeout of 10 seconds for requests
    headers: {
        'Content-Type': 'application/json',
    },
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Get the token from local storage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Include the token in the request headers
        }
        return config; // Return the modified config
    },
    (error) => {
        return Promise.reject(error); // Reject the promise with the error
    }
);

export default axiosInstance;