import axios from "axios";
import { API_URL } from "../UserService";

export const createAction = async (data, access_token) => {
    const headers = {
        Authorization: `Bearer ${access_token}`,
    };
    const res = await axios.post(`${API_URL}/api/v1/actions`, data, {
        headers,
    });
    return res.data;
};

