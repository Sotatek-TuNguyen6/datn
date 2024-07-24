import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Toast from "../LoadingError/Toast";
import * as VoucherService from "../../Services/VoucherService";
import { useMutation } from "react-query";

const AddVoucherMain = () => {
  const [code, setCode] = useState("");
  const [quantity, setQuantity] = useState("");
  const [percent, setPercent] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [isActive, setIsActive] = useState(false);
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

  const mutationAddVoucher = useMutation({
    mutationFn: (data) => VoucherService.createVoucher(data),
    onSuccess: () => {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.success("Thành công!", Toastobjects);
      }
    },
    onError: (error) => {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error(
          error.response.data.message,
          Toastobjects
        );
      }
    },
  });

  const submitHandler = async (event) => {
    event.preventDefault();
    if (code === "" || quantity === "" || percent === "" || expirationDate === "") {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error("Không được để trống!", Toastobjects);
      }
    } else {
      mutationAddVoucher.mutate({
        code,
        usageCount: quantity,
        discount: percent,
        expirationDate,
        isActive,
        maxUsage: quantity
      });
    }
  };

  return (
    <>
      <Toast />
      <section className="content-main" style={{ maxWidth: "1200px" }}>
        <form onSubmit={submitHandler}>
          <div className="content-header">
            <Link to="/review" className="btn btn-danger text-white">
              Quay lại
            </Link>
            <h2 className="content-title">Thêm mã giảm giá</h2>
            <div>
              <button type="submit" className="btn btn-primary" disabled={!code || !quantity || !percent || !expirationDate}>
                Xác nhận thêm
              </button>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-xl-12 col-lg-12">
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  <div className="mb-4">
                    <label htmlFor="code" className="form-label">
                      Mã giảm giá
                    </label>
                    <input
                      type="text"
                      placeholder="Mã giảm giá"
                      className="form-control"
                      required
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="quantity" className="form-label">
                      Số lượng
                    </label>
                    <input
                      type="number"
                      placeholder="Số lượng"
                      className="form-control"
                      required
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="percent" className="form-label">
                      Phần trăm giảm
                    </label>
                    <input
                      type="number"
                      placeholder="Phần trăm giảm"
                      className="form-control"
                      required
                      onChange={(e) => setPercent(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="expirationDate" className="form-label">
                      Ngày hết hạn
                    </label>
                    <input
                      type="date"
                      placeholder="Type here"
                      className="form-control"
                      id="expirationDate"
                      required
                      onChange={(e) => setExpirationDate(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                  
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isActive"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                    <label htmlFor="isActive" className="form-check-label">
                      Kích hoạt
                    </label>
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

export default AddVoucherMain;
