import axios from 'axios';

export const loginUser = async (credentials) => {
    try {
        // Mock login API call
        const res = await axios.post(`/api/auth/login`, credentials);
        if (res.data.success)
            return res.data;
        throw new Error(res.data.message);
    } catch (error) {
        throw new Error(error.message)
    }
};

export const signupUser = async (userData) => {
    try {
        const { password, confirmPassword } = userData;
        if (password !== confirmPassword) throw new Error("Passwords doesn't match")
        // Mock signup API call
        const res = await axios.post(`/api/auth/signup`, userData);
        if (res.data.success)
            return res.data;
        throw new Error(res.data.message);
    } catch (error) {
        throw new Error(error.message)
    }
};