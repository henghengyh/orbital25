import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL, 

    timeout: 60000, // timeout is in ms, not seconds

    headers: {
        'Content-Type': 'application/json',
    },
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); 
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; 
        }
        return config; 
    },
    (error) => {
        return Promise.reject(error); // Rejecting promise (Yi Heng need to learn what is promise)
    }
);

export default axiosInstance;