import axios from "axios";
import { API } from "../utils/apiUrl";
import { axiosJWT } from "./UserService";

export const createVoucher = async (data, access_token) => {
    const headers = {
        Authorization: `Bearer ${access_token}`,
    };
    const res = await axiosJWT.post(`${API}/api/v1/voucher/create`, data, {
        headers,
    });
    return res.data;
};

export const getPay = async (access_token) => {
    const headers = {
        Authorization: `Bearer ${access_token}`,
    };
    const res = await axiosJWT.get(`${API}/api/v1/review`, {
        headers,
    });
    return res.data;
};

export const getDetilsPay = async (id, access_token) => {
    const headers = {
        Authorization: `Bearer ${access_token}`,
    };
    const res = await axiosJWT.get(`${API}/api/v1/voucher/${id}`, {
        headers,
    });
    return res.data;
};

export const updatePay = async (id, data,access_token) => {
    const headers = {
        Authorization: `Bearer ${access_token}`,
    };
    const res = await axios.put(`${API}/api/v1/voucher/${id}`, data, {
        headers,
    });
    return res.data;
};

export const deletePay = async (id) => {
    const res = await axios.delete(`${API}/api/v1/pay/${id}`);
    return res.data;
};

export const createReview = async (data) => {
    const res = await axios.post(`${API}/api/v1/review`, data);
    return res.data;
  };
  