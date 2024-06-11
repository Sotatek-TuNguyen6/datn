import axios from "axios";
import { API } from "../utils/apiUrl";


export const getAll = async () => {
    try {
        const listReview = await axios.get(`${API}/api/v1/review`)
        return listReview.data
    } catch (error) {
        console.log("error", error)
        throw error;
    }
}

export const getDetailReview = async (id) => {
    try {
        const listReview = await axios.get(`${API}/api/v1/review/${id}`)
        return listReview.data
    } catch (error) {
        console.log("error", error)
        throw error;
    }
}

export const updateReview = async (id, data, access_token) => {
    try {
        const headers = {
            Authorization: `Bearer ${access_token}`
        };
        const result = await axios.put(`${API}/api/v1/review/${id}`, data, {
            headers,
        })
        return result.data
    } catch (error) {
        console.log("error: ", error)
        throw error
    }
}


