import callAxios from './axios';

export const createTest = async (data) => {
    const axiosInstance = await callAxios();
    try {
        if (!data) throw new Error('data must be provided')
        data.hasSections = Boolean(data.hasSections)
        // Mock login API call
        const res = await axiosInstance.post(`/test/create`, data);
        if (res.data.success)
            return res.data;
        throw new Error(res.data.message);
    } catch (error) {
        throw new Error(error.message)
    }
};

export const getTests = async (data) => {
    const axiosInstance = await callAxios();
    try {
        // Mock login API call
        const res = await axiosInstance.post(`/test/get-tests`, data);
        if (res.data.success)
            return res.data;
        throw new Error(res.data.message);
    } catch (error) {
        throw new Error(error.message)
    }
};

export const getTestById = async (data) => {
    const axiosInstance = await callAxios();
    try {
        if (!data.testid) throw new Error('testid not set')
        // Mock login API call
        const res = await axiosInstance.get(`/test/get-test-details/${data.testid}`);
        if (res.data.success)
            return res.data;
        throw new Error(res.data.message);
    } catch (error) {
        throw new Error(error.message)
    }
};

export const getWatchTestDetails = async (data) => {
    const axiosInstance = await callAxios();
    try {
        if (!data.testid) throw new Error('testid not set')
        // Mock login API call
        const res = await axiosInstance.get(`/test/get-test-watch/${data?.testid}`);
        if (res.data.success)
            return res.data;
        throw new Error(res.data.message);
    } catch (error) {
        throw new Error(error.message)
    }
};

export const updateTestById = async (data, testid) => {
    const axiosInstance = await callAxios();
    try {
        if (!testid) throw new Error('testid not set')
        // Mock login API call
        const res = await axiosInstance.patch(`/test/update-test/${testid}`, data || {});
        if (res.data.success)
            return res.data;
        throw new Error(res.data.message);
    } catch (error) {
        throw new Error(error.message)
    }
};

export const publishTest = async (data, testid) => {
    const axiosInstance = await callAxios();
    try {
        if (!testid) throw new Error('testid not set')
        // Mock login API call
        const res = await axiosInstance.patch(`/test/publish-test/${testid}`, data);
        if (res.data.success)
            return res.data;
        throw new Error(res.data.message);
    } catch (error) {
        throw new Error(error.message)
    }
}

export const getScoreBoard = async (testid) => {
    const axiosInstance = await callAxios();
    try {
        if (!testid) throw new Error('Invalid Credentials')
        const res = await axiosInstance.get(`/test/get-score-board/${testid}`);
        if (res.data.success)
            return res.data;
        throw new Error(res.data.message);
    } catch (error) {
        console.log(error);
        throw new Error(error.message)
    }
}