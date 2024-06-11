import axios from "axios";
import { API } from "../utils/apiUrl";
import { axiosJWT } from "./UserService";

export const getAll = async () => {
  const res = await axios.get(`${API}/api/v1/product`);
  return res.data;
};

export const createProduct = async (data, access_token) => {
  const res = await axiosJWT.post(`${API}/api/v1/product`, data, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const getDetailProduct = async (id) => {
  const res = await axios.get(`${API}/api/v1/product/${id}`);
  return res.data;
};

export const updateProduct = async (id, data, access_token) => {
  const res = await axiosJWT.put(`${API}/api/v1/product/${id}`, data, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const deleteProduct = async (id, access_token) => {
  const res = await axiosJWT.delete(`${API}/api/v1/product/${id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
};
