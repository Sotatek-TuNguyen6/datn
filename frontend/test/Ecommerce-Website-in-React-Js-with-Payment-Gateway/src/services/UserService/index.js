import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL;

export const createdUser = async (data) => {
    try {
        const postData = await axios.post(`${API_URL}/api/v1/account/register`, data)
        if (postData) {
            return true;
        }
        else return false
    } catch (error) {
        console.log(error)
        return false
    }
}

export const loginUser = async (data) => {
    try {
        const postLogin = await axios.post(`${API_URL}/api/v1/account/login`, data)
        if (postLogin) {
            const { access_token } = postLogin.data;

            localStorage.setItem('access_token', access_token);

            return postLogin.data;
        }
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}