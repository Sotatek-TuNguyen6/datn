import React, { useState, useEffect } from "react";
import Toast from "../LoadingError/Toast";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/LoadingError";
import * as UserService from "../../Services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import { useGetDetailUser } from "../../hooks/callApiCache";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};

const EditOrderMain = (props) => {
  const { id } = props;
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [addresses, setAddresses] = useState(['']);
  const [role, setRole] = useState("")
  const [phone, setPhone] = useState("")
  const [orders, setOrder] = useState([])
  const [wishlist, setWishList] = useState([])

  const toastId = React.useRef(null);
  const { access_token } = useSelector((state) => state.user)

  const handleAddAddress = () => {
    setAddresses([...addresses, '']);
  };

  const handleAddressChange = (index, value) => {
    const newAddresses = [...addresses];
    newAddresses[index] = value;
    setAddresses(newAddresses);
  };
  const Toastobjects = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const mutation = useMutationHooks(async (data) => {
    const { id, access_token, dataUpdate } = data;
    await UserService.updateUser(id, dataUpdate, access_token);
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    const access_token = JSON.parse(localStorage.getItem("access_token"));
    const dataUpdate = {
      name,
      email,
      phone,
      addresses,
      orders,
      wishlist,
    }
    mutation.mutate({
      id: id,
      dataUpdate,
      access_token,
    });
  };

  const { error, isSuccess } = mutation;

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
  }, [id, error, isSuccess]);

  const getListQuery = useGetDetailUser(id, access_token);
  const { isLoading, data: dataDetail } = getListQuery

  useEffect(() => {
    if (dataDetail) {
      setName(dataDetail.name)
      setEmail(dataDetail.email)
      setAddresses(dataDetail.addresses)
      setOrder(dataDetail.orders)
      setWishList(dataDetail.wishlist)
      setRole(dataDetail.role)
      setPhone(dataDetail.phone)
    }
  }, [dataDetail])
  return (
    <>
      <Toast />
      <section className="content-main" style={{ maxWidth: "1200px" }}>
        <form onSubmit={handleUpdate}>
          <div className="content-header">
            <Link to="/users" className="btn btn-danger text-white">
              Về trang danh sách người dùng
            </Link>
            <h2 className="content-title">Update User</h2>
            <div>
              <button type="submit" className="btn btn-primary">
                Xác nhận sửa
              </button>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-xl-12 col-lg-12">
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  {false && <Message variant="alert-danger">error</Message>}
                  {false ? (
                    <Loading />
                  ) : (
                    <>
                      <div className="mb-4">
                        <label htmlFor="product_title" className="form-label">
                          Tên người dùng
                        </label>
                        <input
                          type="text"
                          placeholder="Tên sản phẩm"
                          className="form-control"
                          id="product_title"
                          value={name}
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
                          value={email}
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
                            value={address}
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
                          value={phone}
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
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                        >
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default EditOrderMain;
