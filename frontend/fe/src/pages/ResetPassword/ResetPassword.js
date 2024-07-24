import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, CircularProgress, Backdrop } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as UserService from '../../services/UserService/index'; // Adjust the path as necessary
import { useMutation } from '@tanstack/react-query';
import Toast from '../../components/Toast/Toast';

const ResetPassword = () => {
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

  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const mutationSendRestPassword = useMutation({
    mutationFn: ({ data }) => UserService.resetPassword(data),
    onSuccess: () => {

      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.success("Success Reset Password!", Toastobjects);
      }
      navigate('/signIn');
    },
    onError: (error) => {
      if (error.response.status === 502) {
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.success('The system is busy at the moment. Please try again later.', Toastobjects);
        }
        return;
      }

      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.success(error.response.data.message, Toastobjects);
      }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const data = {
        token,
        passwordNew: password
      }
      mutationSendRestPassword.mutate({ data })
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Toast /> */}

      <section className="resetPassword mb-5">
        <div className="breadcrumbWrapper">
          <div className="container-fluid">
            <ul className="breadcrumb breadcrumb2 mb-0">
              <li>
                <Link to="/">Home</Link>{" "}
              </li>
              <li>Reset Password</li>
            </ul>
          </div>
        </div>

        <div className="loginWrapper">
          <div className="card shadow">
            <Backdrop
              sx={{ color: "#000", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}
              className="formLoader"
            >
              <CircularProgress color="inherit" />
            </Backdrop>

            <h3>Reset Password</h3>
            <form className="mt-4" onSubmit={handleSubmit}>
              <div className="form-group mb-4 w-100">
                <TextField
                  id="password"
                  type="password"
                  name="password"
                  label="New Password"
                  className="w-100"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                />
              </div>
              <div className="form-group mb-4 w-100">
                <TextField
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  label="Confirm Password"
                  className="w-100"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  required
                />
              </div>

              <div className="form-group mt-5 mb-4 w-100">
                <Button
                  className="btn btn-g btn-lg w-100"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Reset Password'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ResetPassword;
