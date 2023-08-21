import callAxios from './axios';

export const createAnswer = async (data) => {
    const axiosInstance = await callAxios();
    try {
        if (!data.questionid || !data.regid) throw new Error('Invalid Credentials');
        const res = await axiosInstance.post(`/answer/create-answer`, data);
        if (res.data.success)
            return res.data;
        throw new Error(res.data.message);
    } catch (error) {
        console.log(error);
        throw new Error(error.message)
    }
}

export const updateAnswer = async (data, id) => {
    const axiosInstance = await callAxios();
    try {
        if (!data || !id) throw new Error('Invalid Credentials');
        const res = await axiosInstance.patch(`/answer/update-answer/${id}`, data);
        if (res.data.success)
            return res.data;
        throw new Error(res.data.message);
    } catch (error) {
        console.log(error);
        throw new Error(error.message)
    }
}
