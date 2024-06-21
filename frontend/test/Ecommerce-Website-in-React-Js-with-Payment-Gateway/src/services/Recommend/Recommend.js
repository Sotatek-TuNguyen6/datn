import axios from "axios"
import { API_URL } from "../UserService/index"


export const getRecommend = async (id) => {
    try {
        const listProduct = await axios.get(`${API_URL}/api/v1/recommend/${id}`)
        return listProduct.data
    } catch (error) {
        console.log(error)
        throw error
    }
}