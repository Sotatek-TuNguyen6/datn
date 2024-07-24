import React, { useState } from "react";
import { TextField, Button, CircularProgress, Backdrop } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import * as UserService from "../../services/UserService/index";
import Toast from "../../components/Toast/Toast";

const ForgotPassword = ({ showLoader }) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

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

    const mutationSendRestPassword = useMutation({
        mutationFn: ({ email }) => UserService.forgotPassword(email),
        onSuccess: () => {
            if (!toast.isActive(toastId.current)) {
                toastId.current = toast.success("Please check your email for the password reset link.", Toastobjects);
            }
        },
        onError: (error) => {
            if (error.response.status === 502) {
                if (!toast.isActive(toastId.current)) {
                    toastId.current = toast.error("The system is busy at the moment. Please try again later.", Toastobjects);
                }
                return;
            }
            if (!toast.isActive(toastId.current)) {
                toastId.current = toast.error(error.response.data.message, Toastobjects);
            }
            return;
        },
    });
    const handleForgotPassword = async (email) => {
        mutationSendRestPassword.mutate({ email: email });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await handleForgotPassword(email);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* <Toast /> */}

            <section className="forgotPassword mb-5">
                <div className="breadcrumbWrapper">
                    <div className="container-fluid">
                        <ul className="breadcrumb breadcrumb2 mb-0">
                            <li>
                                <Link to="/">Home</Link>{" "}
                            </li>
                            <li>Forgot Password</li>
                        </ul>
                    </div>
                </div>

                <div className="loginWrapper">
                    <div className="card shadow">
                        <Backdrop
                            sx={{ color: "#000", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={showLoader || loading}
                            className="formLoader"
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop>

                        <h3>Forgot Password</h3>
                        <form className="mt-4" onSubmit={handleSubmit}>
                            <div className="form-group mb-4 w-100">
                                <TextField
                                    id="email"
                                    type="email"
                                    name="email"
                                    label="Email Address"
                                    className="w-100"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    required
                                />
                            </div>

                            <div className="form-group mt-5 mb-4 w-100">
                                <Button
                                    className="btn btn-g btn-lg w-100"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "Sending..." : "Send Reset Link"}
                                </Button>
                            </div>

                            <p className="text-center">
                                Remembered your password?
                                <b>
                                    {" "}
                                    <Link to="/signin">Sign In</Link>
                                </b>
                            </p>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ForgotPassword;
