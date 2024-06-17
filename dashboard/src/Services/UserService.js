import axios from "axios";
import { API } from "../utils/apiUrl";

export const axiosJWT = axios.create();

export const loginUser = async (data) => {
  const res = await axios.post(`${API}/api/v1/account/login`, data);
  return res.data;
};

export const getDetailsUser = async (id, access_token) => {
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };
  const res = await axiosJWT.get(`${API}/api/v1/account/detail/${id}`, {
    headers,
  });
  return res.data;
};
export const logoutUser = async () => {
  const res = await axios.post(`${API}/api/v1/account/logout`);
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("persist:root");
  return res.data;
};

export const registerUser = async (data) => {
  const res = await axios.post(`${API}/api/v1/account/register`, data);
  return res.data;
};

export const getAll = async (access_token) => {
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };
  const res = await axiosJWT.get(`${API}/api/v1/account`, {
    headers,
  });
  return res.data;
};

export const updateUser = async (id, data, access_token) => {
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };
  const res = await axiosJWT.post(
    `${API}/api/v1/account/${id}`,
    data,
    {
      headers,
    }
  );
  return res.data;
};
export const refreshToken = async (token) => {
  const res = await axios.post(`${API}/api/v1/account/refresh_token`, {
    token: token,
  });

  const newAccessToken = res.data.access_token;
  localStorage.setItem("access_token", JSON.stringify(newAccessToken));
  return res.data;
};

export const deleteUser = async (id, access_token) => {
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };
  const res = await axios.delete(`${API}/api/v1/account/${id}`, {
    headers,
  });
  return res.data;
};
