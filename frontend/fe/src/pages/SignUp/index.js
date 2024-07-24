import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import TextField from "@mui/material/TextField";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { Button } from "@mui/material";
import { useState } from "react";
import * as UserService from "../../services/UserService/index";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { useSelector } from "react-redux";
import Toast from "../../components/Toast/Toast";

const SignUp = () => {
  const history = useNavigate();
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
  const [showPassword1, setShowPassword1] = useState(false);
  const userLogin = useSelector((state) => state.user);
  const { access_token } = userLogin;
  const [showLoader, setShowLoader] = useState(false);
  const [formFields, setFormFields] = useState({
    email: "",
    password: "",
    conformPassword: "",
    username: "",
    fullname: "",
  });

  const onSuccess = (data) => {
    setShowLoader(false);
    if (!toast.isActive(toastId.current)) {
      toastId.current = toast.error("Sign Up Failed", Toastobjects);
    }
  };

  const onError = () => {
    setShowLoader(false);
    if (!toast.isActive(toastId.current)) {
      toastId.current = toast.error("Sign Up Failed", Toastobjects);
    }
  };

  const mutation = useMutationHooks(
    async (userData) => {
      return await UserService.createdUser(userData);
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
    const { conformPassword, fullname, ...otherFields } = formFields;
    const userData = { ...otherFields, name: fullname };

    if (Object.values(formFields).some((field) => field === "")) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error("Please fill all the details", Toastobjects);
      }
      return;
    }

    if (formFields.password !== formFields.conformPassword) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error("Passwords do not match", Toastobjects);
      }
      return;
    }

    mutation.mutate(userData);
  };

  const onChangeField = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormFields(() => ({
      ...formFields,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (access_token) {
      history("/");
    }
  }, [access_token]);

  return (
    <>
      <section className="signIn mb-5">
        <div class="breadcrumbWrapper res-hide">
          <div class="container-fluid">
            <ul class="breadcrumb breadcrumb2 mb-0">
              <li>
                <Link to="/">Home</Link>{" "}
              </li>
              <li>SignUp</li>
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

            <h3>SignUp</h3>
            <form className="mt-4">
              <div className="form-group mb-4 w-100">
                <TextField
                  id="fullName"
                  type="text"
                  name="fullname"
                  label="Full Name"
                  className="w-100"
                  onChange={onChangeField}
                  value={formFields.fullname}
                />
              </div>
              <div className="form-group mb-4 w-100">
                <TextField
                  id="username"
                  type="text"
                  name="username"
                  label="User Name"
                  className="w-100"
                  onChange={onChangeField}
                  value={formFields.username}
                />
              </div>
              <div className="form-group mb-4 w-100">
                <TextField
                  id="email"
                  type="email"
                  name="email"
                  label="Email"
                  className="w-100"
                  onChange={onChangeField}
                  value={formFields.email}
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
                <div className="position-relative">
                  <TextField
                    id="conformPassword"
                    type={showPassword1 === false ? "password" : "text"}
                    name="conformPassword"
                    label="Confirm Password"
                    className="w-100"
                    onChange={onChangeField}
                    value={formFields.conformPassword}
                  />
                  <Button
                    className="icon"
                    onClick={() => setShowPassword1(!showPassword1)}
                  >
                    {showPassword1 === false ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <VisibilityOutlinedIcon />
                    )}
                  </Button>
                </div>
              </div>

              <div className="form-group mt-5 mb-4 w-100">
                <Button
                  className="btn btn-g btn-lg w-100"
                  onClick={handleSubmit}
                >
                  Sign Up
                </Button>
              </div>

              <p className="text-center">
                Already have an account
                <b>
                  {" "}
                  <Link to="/signIn">Sign In</Link>
                </b>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;
