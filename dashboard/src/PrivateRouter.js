import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoutes = () => {
  const token = window.localStorage.getItem("access_token");
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
