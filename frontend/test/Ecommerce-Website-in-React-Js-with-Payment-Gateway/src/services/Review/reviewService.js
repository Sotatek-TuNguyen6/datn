import axios from "axios"
import { API_URL } from "../UserService/index"

export const getReview = async (id) => {
    try {
        const getData = await axios.get(`${API_URL}/api/v1/review/product/${id}`)
        return getData.data
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const createReview = async (data, access_token) => {
    try {
        
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };
        const result = await axios.post(`${API_URL}/api/v1/review`, data, {
            headers
        })
        return result.data
    } catch (error) {
        console.log(error);
        throw error
    }
}