import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../Services/UserService";
import { useLocation, useNavigate } from "react-router-dom";
import { updateUser } from "../../features/userSlide/userSlide";

import jwt_decode from "jwt-decode";
import Toast from "../../Components/LoadingError/Toast";
import { useMutationHooks } from "../../hooks/useMutationHooks";

const Toastobjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};

const Login = () => {
  window.scrollTo(0, 0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useNavigate();
  const userLogin = useSelector((state) => state.user);
  const { email } = userLogin;
  const toastId = React.useRef(null);
  const Toastobjects = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };
  const mutation = useMutationHooks((data) => UserService.loginUser(data));
  const { data, error, isLoading, isError, isSuccess } = mutation;
  const submitHandler = async (e) => {
    e.preventDefault();
    if (username === "" && password === "") {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error(
          "Vui lòng điền đẩy đủ thông tin",
          Toastobjects
        );
      }
    } else {
      await mutation.mutate({
        username: username,
        password,
        role: "admin"
      });
    }
  };
  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    // console.log(res);
    dispatch(updateUser({ ...res, access_token: token }));
  };
  useEffect(() => {
    if (error === null && isSuccess) {
      localStorage.setItem("access_token", JSON.stringify(data?.access_token));
      // localStorage.setItem(
      //   "refresh_token",
      //   JSON.stringify(data?.refresh_token)
      // );
      if (data?.access_token) {
        const decoded = jwt_decode(data?.access_token);
        console.log(decoded?.id)
        if (decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token);
        }
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.success("Thành công", Toastobjects);
        }
      }

      // dispatch(updateUser({ data }))
    } else if (error) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error("Lỗi", Toastobjects);
      }
    }

    if (email !== "") {
      history("/");
    }
  }, [isSuccess, history, email, error]);
  return (
    <>
      <Toast />
      <div
        className="card shadow mx-auto"
        style={{ maxWidth: "380px", marginTop: "100px" }}
      >
        <div className="card-body">
          {/* {error && <Message variant="alert-danger">{error}</Message>} */}
          {/* {loading && <Loading />} */}
          <h4 className="card-title mb-4 text-center">Sign in</h4>
          <form onSubmit={submitHandler}>
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
