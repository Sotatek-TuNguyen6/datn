import React, { useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import Table from "../Table/Table";
import * as PaymentService from "../../Services/PaymentService";
import { toast } from "react-toastify";
import Toast from "../LoadingError/Toast";

const Payment = (props) => {
  const { data } = props;
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

  const handleDelete = async (id) => {
    if (id) {
      if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
        const access_token = JSON.parse(localStorage.getItem("access_token"));

        await PaymentService.deletePay(id, access_token)
          .then((res) => {
            if (!toast.isActive(toastId.current)) {
              toastId.current = toast.success("Thành công!", Toastobjects);
            }
          })
          .catch((error) => {
            if (!toast.isActive(toastId.current)) {
              toastId.current = toast.error(error, Toastobjects);
            }
          });
      }
    }
  };

  const formattedAmount = (amount, options) => {
    return amount.toLocaleString(undefined, options);
  };
  const columns = [
    {
      name: "Mã đơn hàng",
      selector: (row) => row.orderId,
    },
    {
      name: "Phương thức thanh toán",
      selector: (row) => row.paymentMethod,
    },
    {
      name: "Thành tiền",
      selector: (row) => formattedAmount(row.amount),
    },
    {
      name: "Tiền tệ",
      selector: (row) => row.currency
    },
    {
      name: "Trạng thái",
      selector: (row) => row.status,
    },
    {
      name: "Trạng thái",
      selector: (row) => moment(row.createdAt).format('DD/MM/YYYY'),
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="d-flex" style={{ width: "450px" }}>
          <Link
            to={`/payment/${row._id}/edit`}
            style={{ marginRight: "5px" }}
          >
            <button className="btn btn-primary">Sửa</button>
          </Link>
          <button
            type="button"
            onClick={() => handleDelete(row._id)}
            className="btn btn-danger"
          >
            Xóa
          </button>
        </div>
      ),
    },
  ];
  return (
    <>
      <Toast />
      <Table data={data} columns={columns} sub={true} />
    </>
  );
};

export default Payment;
