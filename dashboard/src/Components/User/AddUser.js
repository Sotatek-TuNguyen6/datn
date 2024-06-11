import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Toast from "../LoadingError/Toast";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as UserService from "../../Services/UserService";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import '../Product/editor.css'

const AddUserMain = () => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [addresses, setAddresses] = useState(['']);
    const [role, setRole] = useState("")
    const [phone, setPhone] = useState("")
    const [userName, setUserName] = useState("")
    const [passWord, setPassWord] = useState("")
    const handleAddAddress = () => {
        setAddresses([...addresses, '']);
    };

    const handleAddressChange = (index, value) => {
        const newAddresses = [...addresses];
        newAddresses[index] = value;
        setAddresses(newAddresses);
    };
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

    const mutationAddProduct = useMutationHooks((data) => {
        const { ...rests } = data;
        const res = UserService.registerUser(rests);
        return res;
    });

    const submitHandler = async (event) => {
        event.preventDefault();
        if (name === "" || email === "" || userName === "") {
            if (!toast.isActive(toastId.current)) {
                toastId.current = toast.error("Không được để trống!", Toastobjects);
            }
        } else {
            mutationAddProduct.mutate({
                email,
                username: userName,
                password: passWord,
                name: name,
                role: role,
                addresses: addresses,
                phone
            });
        }
    };
    const { error, isSuccess } = mutationAddProduct;
    useEffect(() => {
        if (!error && isSuccess) {
            if (!toast.isActive(toastId.current)) {
                toastId.current = toast.success("Thành công!", Toastobjects);
            }
        } else if (error) {
            if (!toast.isActive(toastId.current)) {
                toastId.current = toast.error(
                    error.response.data.message,
                    Toastobjects
                );
            }
        }
    }, [error, isSuccess]);
    return (
        <>
            <Toast />
            <section className="content-main position-relative" style={{ maxWidth: "1200px" }}>
                {loading &&
                    <>
                        <div
                            className="position-absolute w-screen h-screen bg-gray-50 z-10 border border-gray-200 rounded-lg">
                            <div role="status" className={"position-relative left-1/3 top-1/3"}>
                                <svg aria-hidden="true" className="Toastify__spinner"
                                    viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor" />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill" />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    </>
                }
                <form onSubmit={submitHandler}>
                    <div className="content-header">
                        <Link to="/users" className="btn btn-danger text-white">
                            Về trang người dùng
                        </Link>
                        <h2 className="content-title">Thêm người dùng</h2>
                        <div>
                            <button type="submit" className="btn btn-primary">
                                Xác nhận thêm
                            </button>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-xl-12 col-lg-12">
                            <div className="card mb-4 shadow-sm">
                                <div className="card-body">
                                    <div className="mb-4">
                                        <label htmlFor="product_title" className="form-label">
                                            Tài khoản đăng nhập
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Tài khoản đăng nhập"
                                            className="form-control"
                                            id="product_title"
                                            onChange={(e) => setUserName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="product_title" className="form-label">
                                            Mật khẩu đăng nhập
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Mật khẩu đăng nhập"
                                            className="form-control"
                                            onChange={(e) => setPassWord(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="product_title" className="form-label">
                                            Tên người dùng
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Tên sản phẩm"
                                            className="form-control"
                                            id="product_title"
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="product_title" className="form-label">
                                            Email
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Tên sản phẩm"
                                            className="form-control"
                                            id="product_title"
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    {addresses.map((address, index) => (
                                        <div className="mb-4" key={index}>
                                            <label htmlFor={`address-${index}`} className="form-label">Địa chỉ {index + 1}</label>
                                            <input
                                                type="text"
                                                id={`address-${index}`}
                                                className="form-control"
                                                placeholder="Địa chỉ"
                                                onChange={(e) => handleAddressChange(index, e.target.value)}
                                            />
                                        </div>
                                    ))}
                                    <button type="button" className="btn btn-secondary mb-4" onClick={handleAddAddress}>
                                        Thêm địa chỉ
                                    </button>
                                    <div className="mb-4">
                                        <label htmlFor="product_title" className="form-label">
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Số điện thoại"
                                            className="form-control"
                                            id="product_title"
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="product_title" className="form-label">
                                            Phân quyền
                                        </label>
                                        <select
                                            class="form-select"
                                            aria-label="Default select example"
                                            onChange={(e) => setRole(e.target.value)}
                                        >
                                            <option value="customer">Customer</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </section>
        </>
    );
};

export default AddUserMain;
