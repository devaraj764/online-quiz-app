import { AES, enc } from 'crypto-js';

const secretKey = process.env.REACT_APP_SECRET_KEY;

// Encryption function
export const encrypt = (data) => {
    if (typeof data === 'string')
        return AES.encrypt(data, secretKey).toString();
    else
        return AES.encrypt(data.toString(), secretKey).toString();
};

// Decryption function
const decrypt = (encryptedData) => {
    const bytes = AES.decrypt(encryptedData, secretKey);
    return bytes.toString(enc.Utf8);
};

export const storeItem = async ({ key, value }) => {
    if (!value) return
    try {
        const encData = await encrypt(value);
        localStorage.setItem(key, encData);
    } catch (error) {
        throw new Error(error.message)
    }
}

export const getItem = async ({ key }) => {
    try {
        const encData = localStorage.getItem(key);
        if (!encData) return null;
        const data = await decrypt(encData);
        return JSON.parse(data)
    } catch (error) {
        throw new Error(error.message)
    }
}

export const removeItem = async ({ key }) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        throw new Error(error.message)
    }
}