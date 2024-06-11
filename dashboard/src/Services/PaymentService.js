import axios from "axios";
import { API } from "../utils/apiUrl";
import { axiosJWT } from "./UserService";

export const getListPay = async (access_token) => {
    const headers = {
        Authorization: `Bearer ${access_token}`,
    };
    const res = await axiosJWT.get(`${API}/api/v1/payment`, {
        headers,
    });
    return res.data;
};

export const getDetilsPay = async (id, access_token) => {
    const headers = {
        Authorization: `Bearer ${access_token}`,
    };
    const res = await axiosJWT.get(`${API}/api/v1/payment/detail/${id}`, {
        headers,
    });
    return res.data;
};

export const updatePay = async (id, data,access_token) => {
    const headers = {
        Authorization: `Bearer ${access_token}`,
    };
    const res = await axiosJWT.put(`${API}/api/v1/payment/update/${id}`, data, {
        headers,
    });
    return res.data;
};

export const deletePay = async (id,access_token) => {
    const headers = {
        Authorization: `Bearer ${access_token}`,
    };
    const res = await axiosJWT.delete(`${API}/api/v1/payment/delete/${id}`,{
        headers
    });
    return res.data;
};
