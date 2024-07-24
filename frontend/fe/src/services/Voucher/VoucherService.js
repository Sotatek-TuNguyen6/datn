import axios from "axios"
import { API_URL } from "../UserService/index"

export const applyVoucher = async (data) => {
    try {
        const { access_token, ...body } = data
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };
        const result = await axios.post(`${API_URL}/api/v1/voucher/useVoucher`, body, {
            headers
        })
        return result.data
    } catch (error) {
        console.log(error);
        throw error
    }
}