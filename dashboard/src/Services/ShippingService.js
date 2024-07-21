import axios from "axios";
import { API } from "../utils/apiUrl";


export const getAll = async (access_token) => {
    try {
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };
        const listShipping = await axios.get(`${API}/api/v1/shipping`, { headers })
        return listShipping.data
    } catch (error) {
        console.log("error", error)
        throw error;
    }
}

export const updateShipping = async (data) => {
    try {
        const { access_token, id, ...body } = data
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };
        const listShipping = await axios.put(`${API}/api/v1/shipping/${id}`, body, { headers })
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
        const listShipping = await axios.delete(`${API}/api/v1/shipping/${id}`, { headers })
        return listShipping.data
    } catch (error) {
        console.log("error", error)
        throw error;
    }
}