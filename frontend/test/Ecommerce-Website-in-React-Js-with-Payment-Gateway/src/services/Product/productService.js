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