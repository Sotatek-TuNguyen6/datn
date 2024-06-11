import axios from "axios";
import { API } from "../utils/apiUrl";
import { axiosJWT } from "./UserService";

export const createCategory = async (data, access_token) => {
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };
  const res = await axiosJWT.post(`${API}/api/v1/category`, data, {
    headers,
  });
  return res.data;
};

export const getCategory = async () => {
  const res = await axios.get(`${API}/api/v1/category`);
  return res.data;
};
export const deleteCategory = async (id, access_token) => {
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };
  const res = await axiosJWT.delete(`${API}/api/v1/category/${id}`, null, {
    headers,
  });
  return res.data;
};

