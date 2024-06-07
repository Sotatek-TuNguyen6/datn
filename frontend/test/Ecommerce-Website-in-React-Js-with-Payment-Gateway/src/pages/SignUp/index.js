import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import TextField from '@mui/material/TextField';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { Button } from '@mui/material';
import { useState } from 'react';
import * as UserService from "../../services/UserService/index"
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const SignUp = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);

    const [showLoader, setShowLoader] = useState(false);


    const [formFields, setFormFields] = useState({
        email: '',
        password: '',
        conformPassword: '',
        username: "",
        fullname: ""
    })

    const signUp = async () => {
        try {
            if (formFields.email !== "" && formFields.password !== "" && formFields.conformPassword !== "" && formFields.username !== "" && formFields.fullname !== "") {
                setShowLoader(true);
                const { conformPassword, fullname, ...otherFields } = formFields;

                const userData = { ...otherFields, name: fullname };

                const data = await UserService.createdUser(userData);
                if (data) {
                    setShowLoader(false);
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
                }
                else {
                    setShowLoader(false);
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
                    });
                }
            }
            else {
                toast.error('Please fill all the details', {
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
            }
        } catch (error) {
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
            });
        }

    }


    const onChangeField = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setFormFields(() => ({
            ...formFields,
            [name]: value,
        }))

    }


    return (
        <>
            <ToastContainer />
            <section className='signIn mb-5'>
                <div class="breadcrumbWrapper res-hide">
                    <div class="container-fluid">
                        <ul class="breadcrumb breadcrumb2 mb-0">
                            <li><Link to="/">Home</Link>  </li>
                            <li>SignUp</li>
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

                        <h3>SignUp</h3>
                        <form className='mt-4'>
                            <div className='form-group mb-4 w-100'>
                                <TextField id="fullName" type="text" name='fullname' label="Full Name" className='w-100' onChange={onChangeField} value={formFields.fullname} />
                            </div>
                            <div className='form-group mb-4 w-100'>
                                <TextField id="username" type="text" name='username' label="User Name" className='w-100' onChange={onChangeField} value={formFields.username} />
                            </div>
                            <div className='form-group mb-4 w-100'>
                                <TextField id="email" type="email" name='email' label="Email" className='w-100' onChange={onChangeField} value={formFields.email} />
                            </div>
                            <div className='form-group mb-4 w-100'>
                                <div className='position-relative'>
                                    <TextField id="password" type={showPassword === false ? 'password' : 'text'} name='password' label="Password" className='w-100' onChange={onChangeField}
                                        value={formFields.password} />
                                    <Button className='icon' onClick={() => setShowPassword(!showPassword)}>
                                        {
                                            showPassword === false ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />
                                        }

                                    </Button>
                                </div>

                            </div>

                            <div className='form-group mb-4 w-100'>
                                <div className='position-relative'>
                                    <TextField id="conformPassword" type={showPassword1 === false ? 'password' : 'text'} name='conformPassword' label="Confirm Password" className='w-100' onChange={onChangeField} value={formFields.conformPassword} />
                                    <Button className='icon' onClick={() => setShowPassword1(!showPassword1)}>
                                        {
                                            showPassword1 === false ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />
                                        }

                                    </Button>
                                </div>

                            </div>


                            <div className='form-group mt-5 mb-4 w-100'>
                                <Button className='btn btn-g btn-lg w-100' onClick={signUp}>Sign Up</Button>
                            </div>

                            <p className='text-center'>Already have an account
                                <b> <Link to="/signIn">Sign In</Link>
                                </b>
                            </p>



                        </form>
                    </div>
                </div>


            </section>
        </>
    )
}

export default SignUp;
