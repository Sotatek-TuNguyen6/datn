import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import * as UserService from "../../services/UserService/index";
import TextField from "@mui/material/TextField";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { Button } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../features/userSlice/userSlice";
import Toast from "../../components/Toast/Toast";

const SignIn = () => {
  window.scrollTo(0, 0)
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
  const [showPassword, setShowPassword] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [formFields, setFormFields] = useState({
    username: "",
    password: "",
  });
  const userLogin = useSelector((state) => state.user);
  const { access_token } = userLogin;
  const dispatch = useDispatch();
  const history = useNavigate();

  const onChangeField = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormFields(() => ({
      ...formFields,
      [name]: value,
    }));
  };

  const onSuccess = (data) => {
    if (!toast.isActive(toastId.current)) {
      toastId.current = toast.success("Login Success!", Toastobjects);
    }
    setShowLoader(false);
  };

  const onError = (error) => {
    if (!toast.isActive(toastId.current)) {
      toastId.current = toast.error("Login Fail!", Toastobjects);
    }
    setShowLoader(false);
  };

  const mutation = useMutationHooks(
    async ({ username, password }) => {
      return await UserService.loginUser({ username, password });
    },
    {
      onMutate: () => {
        setShowLoader(true);
      },
      onSuccess,
      onError,
    }
  );

  const handleSubmit = () => {
    if (formFields.username !== "" && formFields.password !== "") {
      mutation.mutate({
        username: formFields.username,
        password: formFields.password,
      });
    } else {
      console.log("Please fill all the details");
    }
  };

  const { error, isLoading, isSuccess, isError, data } = mutation;

  const handleGetDetailsUser = async (id, accessToken) => {
    const header = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    try {
      const userDetails = await UserService.getDetailUser(id, header);

      dispatch(updateUser({ ...userDetails, access_token: accessToken }));
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  useEffect(() => {
    if (!error && isSuccess) {
      localStorage.setItem("access_token", JSON.stringify(data.access_token));
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token);
        if (decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token);
        }
      }
      history("/");
    }
    if (access_token) {
      history("/");
    }
  }, [error, isSuccess, access_token]);

  return (
    <>
      {/* <Toast /> */}

      <section className="signIn mb-5">
        <div className="breadcrumbWrapper">
          <div className="container-fluid">
            <ul className="breadcrumb breadcrumb2 mb-0">
              <li>
                <Link to="/">Home</Link>{" "}
              </li>
              <li>Sign In</li>
            </ul>
          </div>
        </div>

        <div className="loginWrapper">
          <div className="card shadow">
            <Backdrop
              sx={{ color: "#000", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={showLoader}
              className="formLoader"
            >
              <CircularProgress color="inherit" />
            </Backdrop>

            <h3>Sign In</h3>
            <form className="mt-4">
              <div className="form-group mb-4 w-100">
                <TextField
                  id="username"
                  type="username"
                  name="username"
                  label="User Name"
                  className="w-100"
                  onChange={onChangeField}
                  value={formFields.username}
                />
              </div>
              <div className="form-group mb-4 w-100">
                <div className="position-relative">
                  <TextField
                    id="password"
                    type={showPassword === false ? "password" : "text"}
                    name="password"
                    label="Password"
                    className="w-100"
                    onChange={onChangeField}
                    value={formFields.password}
                  />
                  <Button
                    className="icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword === false ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <VisibilityOutlinedIcon />
                    )}
                  </Button>
                </div>
              </div>
              <div className="form-group mb-4 w-100">
                <p className="text-end">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </p>
              </div>

              <div className="form-group mt-5 mb-4 w-100">
                <Button
                  className="btn btn-g btn-lg w-100"
                  onClick={handleSubmit}
                >
                  Sign In
                </Button>
              </div>

              <p className="text-center">
                Not have an account?
                <b>
                  {" "}
                  <Link to="/signup">Sign Up</Link>
                </b>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignIn;
