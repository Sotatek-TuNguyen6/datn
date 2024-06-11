import React, { useState, useEffect } from "react";
import Toast from "./../LoadingError/Toast";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/LoadingError";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import { useQuery } from "react-query";
import * as PaymentService from "../../Services/PaymentService";
import { toast } from "react-toastify";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};

const EditPaymentMain = (props) => {
  const { id } = props;
  const [status, setStatus] = useState("");

  const dispatch = useDispatch();

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
  const handleGetDetailsPayment = async () => {
    const access_token = JSON.parse(localStorage.getItem("access_token"));
    const res = await PaymentService.getDetilsPay(id, access_token);
    setStatus(res.status);
    return res;
  };
  const mutation = useMutationHooks((data) => {
    const { id, access_token, ...rests } = data;
    PaymentService.updatePay(id, rests, access_token);
  });
  const { data, error, isLoading, isError, isSuccess } = mutation;
  const handleUpdate = (e) => {
    e.preventDefault();
    const access_token = JSON.parse(localStorage.getItem("access_token"));

    mutation.mutate({
      id: id,
      status,
      access_token,
    });

    // mutation.mutate(decoded?.id, { phone, name, email, sex })
  };

  const { isLoading: getDetail, data: dataDetail } = useQuery(
    ["products"],
    handleGetDetailsPayment
  );
  useEffect(() => {
    if (dataDetail) {
    }
  }, [dataDetail]);
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
  return (
    <>
      <Toast />
      <section className="content-main" style={{ maxWidth: "1200px" }}>
        <form onSubmit={handleUpdate}>
          <div className="content-header">
            <Link to="/payment" className="btn btn-danger text-white">
              Về trang thanh toán
            </Link>
            <h2 className="content-title">Sửa thanh toán</h2>
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
                  {/* Error Loading */}
                  {false && <Message variant="alert-danger">error</Message>}
                  {/* Update Loading */}

                  {/* {productSingleStatus && <Loading />} */}

                  {/* productSingleStatus Loading */}
                  {getDetail ? (
                    <Loading />
                  ) : (
                    <>
                      <div className="mb-4">
                        <label className="form-label">Trạng thái</label>
                        <select
                          className="form-control"
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option
                            value="pending"
                            selected={status === "pending"}
                          >
                            Chưa hoàn thành
                          </option>
                          <option
                            value="delivered"
                            selected={status === "delivered"}
                          >
                            Hoàn thành
                          </option>
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

export default EditPaymentMain;
