// axiosInstance.js
import axios from 'axios';

const callAxios = async () => axios.create({
    baseURL: '/api', // Replace with your API base URL
    headers: {
        'Content-Type': 'application/json', // Set your desired Content-Type
        token: localStorage.getItem('token'),
    },
});

export default callAxios;
