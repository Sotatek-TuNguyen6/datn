import axios from "axios"
import { API_URL } from "../UserService/index"

export const getShipping = async (access_token) => {
    try {
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };
        const getData = await axios.get(`${API_URL}/api/v1/shipping`, { headers })
        return getData.data
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const updateShipping = async (data) => {
    try {
        const { access_token, id, ...body } = data
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };
        const listShipping = await axios.put(`${API_URL}/api/v1/shipping/${id}`, body, { headers })
        return listShipping.data
    } catch (error) {
        console.log("error", error)
        throw error;
    }
}

export const deleteShipping = async (data) => {
    try {
        const { access_token, id } = data
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };
        const listShipping = await axios.delete(`${API_URL}/api/v1/shipping/${id}`, { headers })
        return listShipping.data
    } catch (error) {
        console.log("error", error)
        throw error;
    }
}