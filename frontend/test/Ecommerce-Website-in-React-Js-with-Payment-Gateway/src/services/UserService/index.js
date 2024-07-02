import axios from "axios"
import Wishlist from "../../pages/Wishlist";

export const API_URL = process.env.REACT_APP_API_URL;

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

export const getDetailUser = async (id, header) => {
    try {
        const response = await axios.get(`${API_URL}/api/v1/account/detail/${id}`, {
            headers: header
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
};

export const updateWishlist = async (idProduct, access_token) => {
    try {
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };
        const response = await axios.put(
            `${API_URL}/api/v1/account/wishlist/${idProduct}`,
            {},
            { headers }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating wishlist:', error);
        throw error;
    }
}

export const addWishlist = async (data, access_token) => {
    try {
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };
        const response = await axios.post(
            `${API_URL}/api/v1/account`,
            {
                wishlist: data
            },
            { headers }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating wishlist:', error);
        throw error;
    }
}

export const updateUser = async (data, access_token) => {
    try {
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };
        const response = await axios.post(
            `${API_URL}/api/v1/account`,
            data,
            { headers }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating User:', error);
        throw error;
    }
}

export const updatePassword = async (data, access_token) => {
    try {
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };
        const response = await axios.post(
            `${API_URL}/api/v1/account/update/password`,
            data,
            { headers }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating User:', error);
        throw error;
    }
}

export const forgotPassword = async (data) => {
    try {
        const sendReq = await axios.post(`${API_URL}/api/v1/account/forgotPassword/email`, { email: data })
        return sendReq.data;
    } catch (error) {
        console.error('Error updating User:', error);
        throw error;
    }
}

export const resetPassword = async (data) => {
    try {
        const { passwordNew, token } = data
        const sendReq = await axios.post(`${API_URL}/api/v1/account/reset-password/${token}`, { passwordNew: passwordNew })
        return sendReq.data;
    } catch (error) {
        console.error('Error updating User:', error);
        throw error;
    }
}