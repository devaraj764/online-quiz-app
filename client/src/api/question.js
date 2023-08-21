import callAxios from './axios';

export const createQuestion = async (data) => {
    const axiosInstance = await callAxios();
    try {
        if (!data) throw new Error('Invalid Credentials')
        const res = await axiosInstance.post(`/question/create-question`, data);
        if (res.data.success)
            return res.data;
        throw new Error(res.data.message);
    } catch (error) {
        throw new Error(error.message)
    }
}

export const findQuestionById = async (id) => {
    const axiosInstance = await callAxios();
    try {
        if (!id) throw new Error('Invalid Credentials')
        const res = await axiosInstance.get(`/question/get-question/${id}`);
        if (res.data.success)
            return res.data;
        throw new Error(res.data.message);
    } catch (error) {
        throw new Error(error.message)
    }
}

export const getQuestions = async (data) => {
    const axiosInstance = await callAxios();
    try {
        if (!data || !data.test || !data.section) throw new Error('Invalid Credentials');
        const res = await axiosInstance.post(`/question/get-questions`, data);
        if (res.data.success)
            return res.data;
        throw new Error(res.data.message);
    } catch (error) {
        console.log(error);
        throw new Error(error.message)
    }
}

export const getQuestionsWithAnswers = async ({ testid, section, regid }) => {
    const axiosInstance = await callAxios();
    try {
        if (!testid || !section || !regid) throw new Error('Invalid Credentials');
        const res = await axiosInstance.post(`/answer/get-anwers`, { testid, section, regid });
        if (res.data.success)
            return res.data;
        throw new Error(res.data.message);
    } catch (error) {
        console.log(error);
        throw new Error(error.message)
    }
}

export const updateQuestion = async (data, id) => {
    const axiosInstance = await callAxios();
    try {
        if (!data || !id) throw new Error('Invalid Credentials');
        const res = await axiosInstance.post(`/question/update-question/${id}`, data);
        if (res.data.success)
            return res.data;
        throw new Error(res.data.message);
    } catch (error) {
        console.log(error);
        throw new Error(error.message)
    }
}

export const deleteQuestion = async (id) => {
    const axiosInstance = await callAxios();
    try {
        if (!id) throw new Error('Invalid Credentials')
        const res = await axiosInstance.delete(`/question/delete-question/${id}`);
        if (res.data.success)
            return res.data;
        throw new Error(res.data.message);
    } catch (error) {
        console.log(error);
        throw new Error(error.message)
    }
}
