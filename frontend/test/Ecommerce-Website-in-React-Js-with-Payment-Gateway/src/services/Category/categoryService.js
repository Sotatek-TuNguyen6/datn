import axios from "axios";
import { API_URL } from "../UserService";

export const createCategory = async (data, access_token) => {
    const headers = {
        Authorization: `Bearer ${access_token}`,
    };
    const res = await axios.post(`${API_URL}/api/v1/category`, data, {
        headers,
    });
    return res.data;
};

export const getCategory = async () => {
    try {
        const res = await axios.get(`${API_URL}/api/v1/category`);
        return res.data;
    } catch (error) {
        console.log('errror: ', error);
        throw error;
    }
};
export const deleteCategory = async (id, access_token) => {
    const headers = {
        Authorization: `Bearer ${access_token}`,
    };
    const res = await axios.delete(`${API_URL}/api/v1/category/${id}`, null, {
        headers,
    });
    return res.data;
};

