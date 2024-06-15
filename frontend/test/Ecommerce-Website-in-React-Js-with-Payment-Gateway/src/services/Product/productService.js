import axios from "axios"
import { API_URL } from "../UserService/index"

export const getProduct = async () => {
    try {
        const listProduct = await axios.get(`${API_URL}/api/v1/product`)
        return listProduct.data
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getProductDetail = async (id) => {
    try {
        const getDetails = await axios.get(`${API_URL}/api/v1/product/${id}`);
        return getDetails.data;
    } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 404) {
            throw new Error("NOT_FOUND");
        }
        throw error;
    }
}