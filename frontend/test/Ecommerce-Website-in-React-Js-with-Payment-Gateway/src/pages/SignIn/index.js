import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import * as UserService from "../../services/UserService/index"
import TextField from '@mui/material/TextField';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { Button } from '@mui/material';
import { useState } from 'react';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { useMutationHooks } from '../../hooks/useMutationHook';
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from '../../features/userSlice/userSlice';

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [formFields, setFormFields] = useState({
        username: '',
        password: '',
    })
    const userLogin = useSelector((state) => state.user);
    const { access_token } = userLogin
    const dispatch = useDispatch();
    const history = useNavigate();

    const onChangeField = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setFormFields(() => ({
            ...formFields,
            [name]: value,
        }))

    }

    const onSuccess = (data) => {
        toast('Login Success!', {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
        setShowLoader(false);
    };

    const onError = (error) => {
        toast.error('Login Fail', {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
            className: 'custom-toast',
        });
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
            mutation.mutate({ username: formFields.username, password: formFields.password });
        } else {
            alert("Please fill all the details");
        }
    };

    const { error, isLoading, isSuccess, isError, data } = mutation;

    const handleGetDetailsUser = async (id, accessToken) => {
        const header = {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        };

        try {
            const userDetails = await UserService.getDetailUser(id, header);

            dispatch(updateUser({ ...userDetails, access_token: accessToken }))
        } catch (error) {
            console.error('Failed to fetch user details:', error);
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
    }, [error, isSuccess, access_token])

    return (
        <>
            <ToastContainer />

            <section className='signIn mb-5'>
                <div class="breadcrumbWrapper">
                    <div class="container-fluid">
                        <ul class="breadcrumb breadcrumb2 mb-0">
                            <li><Link to="/">Home</Link>  </li>
                            <li>Sign In</li>
                        </ul>
                    </div>
                </div>



                <div className='loginWrapper'>
                    <div className='card shadow'>
                        <Backdrop
                            sx={{ color: '#000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={showLoader}
                            className="formLoader"
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop>

                        <h3>Sign In</h3>
                        <form className='mt-4'>
                            <div className='form-group mb-4 w-100'>
                                <TextField id="username" type="username" name='username' label="User Name" className='w-100'
                                    onChange={onChangeField} value={formFields.email} />
                            </div>
                            <div className='form-group mb-4 w-100'>
                                <div className='position-relative'>
                                    <TextField id="password" type={showPassword === false ? 'password' : 'text'} name='password' label="Password" className='w-100'
                                        onChange={onChangeField} value={formFields.password} />
                                    <Button className='icon' onClick={() => setShowPassword(!showPassword)}>
                                        {
                                            showPassword === false ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />
                                        }

                                    </Button>
                                </div>
                            </div>



                            <div className='form-group mt-5 mb-4 w-100'>
                                <Button className='btn btn-g btn-lg w-100' onClick={handleSubmit} >Sign In</Button>
                            </div>


                            <div className='form-group mt-5 mb-4 w-100 signInOr'>
                                <p className='text-center'>OR</p>
                                {/* <Button className='w-100' variant="outlined" onClick={signInWithGoogle}><img src={GoogleImg} />
                                    Sign In with Google</Button> */}
                            </div>


                            <p className='text-center'>Not have an account
                                <b> <Link to="/signup">Sign Up</Link>
                                </b>
                            </p>

                        </form>
                    </div>
                </div>


            </section>
        </>
    )
}

export default SignIn;
