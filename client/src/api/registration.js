import callAxios from './axios';

export const registerTest = async (testid, data) => {
    const axiosInstance = await callAxios();
    try {
        if (!testid) throw new Error('Invalid Credentials');
        const res = await axiosInstance.post(`/registration/register-test/${testid}`, data);
        if (res.data.success)
            return res.data;
        throw new Error(res.data.message);
    } catch (error) {
        console.log(error);
        throw new Error(error.message)
    }
}

export const getRegistrations = async (data) => {
    const axiosInstance = await callAxios();
    try {
        // Mock login API call
        const res = await axiosInstance.post(`/registration/get-registrations`, data);
        if (res.data.success)
            return res.data;
        throw new Error(res.data.message);
    } catch (error) {
        throw new Error(error.message)
    }
};


export const unregisterTest = async (testid) => {
    const axiosInstance = await callAxios();
    try {
        if (!testid) throw new Error('Invalid Credentials');
        const res = await axiosInstance.post(`/registration/unregister-test/${testid}`);
        if (res.data.success)
            return res.data;
        throw new Error(res.data.message);
    } catch (error) {
        console.log(error);
        throw new Error(error.message)
    }
}

export const getRegistrationDetails = async (data) => {
    const axiosInstance = await callAxios();
    try {
        if (!data.id) throw new Error('id not set')
        // Mock login API call
        const res = await axiosInstance.get(`/registration/get-registration-details/${data?.id}`);
        if (res.data.success)
            return res.data;
        throw new Error(res.data.message);
    } catch (error) {
        throw new Error(error.message)
    }
};

export const updateReistrationById = async (data, regid) => {
    const axiosInstance = await callAxios();
    try {
        if (!regid) throw new Error('regid not set')
        // Mock login API call
        const res = await axiosInstance.patch(`/registration/update-registration/${regid}`, data);
        if (res.data.success)
            return res.data;
        throw new Error(res.data.message);
    } catch (error) {
        throw new Error(error.message)
    }
};

export const submitTest = async (data) => {
    const axiosInstance = await callAxios();
    if (!data.regid || !data.testid) throw new Error('Invalid Args')
    try {
        const res = await axiosInstance.post(`/registration/submit-test`, data);
        if (res.data.success)
            return res.data;
        throw new Error(res.data.message);
    } catch (error) {
        console.log(error);
        throw new Error(error.message)
    }
}
