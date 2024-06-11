import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Toast from "../LoadingError/Toast";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/LoadingError";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as CategoryService from "../../Services/CategoryService";

const AddProductMain = () => {
  const [name, setName] = useState("");
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

  const mutationAddCategory = useMutationHooks(async (data) => {
    const { access_token, ...rests } = data;
    const res = await CategoryService.createCategory(rests, access_token);
    return res;
  });

  const submitHandler = async (event) => {
    event.preventDefault();
    if (name === "") {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error("Không được để trống!", Toastobjects);
      }
    } else {
      const access_token = JSON.parse(localStorage.getItem("access_token"));
      await mutationAddCategory.mutate({
        categoryName: name,
        access_token,
      });
    }
  };

  const { error, isLoading, isSuccess, isError } = mutationAddCategory;
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
      <section className="content-main" style={{ maxWidth: "1200px" }}>
        <form onSubmit={submitHandler}>
          <div className="content-header">
            <Link to="/category" className="btn btn-danger text-white">
              Về trang danh mục
            </Link>
            <h2 className="content-title">Thêm mới danh mục</h2>
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
                  {/* {error && <Message variant="alert-danger">{error}</Message>}
                  {loading && <Loading />} */}
                  <div className="mb-4">
                    <label htmlFor="product_title" className="form-label">
                      Tên danh mục
                    </label>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="form-control"
                      id="product_title"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
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

export default AddProductMain;
