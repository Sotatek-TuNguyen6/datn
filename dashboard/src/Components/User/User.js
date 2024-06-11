import React, { useState } from "react";
import { Link } from "react-router-dom";
import Table from "../Table/Table";
import * as UserService from "../../Services/UserService";
import { toast } from "react-toastify";
import Toast from "../LoadingError/Toast";

const Users = (props) => {
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

        await UserService.deleteUser(id, access_token)
          .then((res) => {
            if (!toast.isActive(toastId.current)) {
              toastId.current = toast.success("Thành công!", Toastobjects);
            }
            window.location.reload();
          })
          .catch((error) => {
            if (!toast.isActive(toastId.current)) {
              toastId.current = toast.error(error, Toastobjects);
            }
          });
      }
    }
  };
  const columns = [
    {
      name: "ID",
      selector: (row) => row._id,
    },
    {
      name: "Tài khoản",
      selector: (row) => row.username,
    },
    {
      name: "Họ và tên",
      selector: (row) => row.name,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Địa chí",
      selector: (row) => row.addresses[0],
    },
    {
      name: "Điện thoại",
      selector: (row) => row.phone,
    },
    {
      name: "Số lượng đơn hàng",
      selector: (row) => row.orders.length,
    },
    {
      name: "Quản trị viên",
      selector: (row) => (row.role !== "customer" ? "Admin" : "Người dùng"),
    },
    {
      name: "Hành động",
      selector: (row) => (
        <div className="d-flex " style={{ width: "450px" }}>
          <Link
            to={`/user/${row._id}`}
            style={{ paddingRight: "5px" }}
          >
            <button className="btn btn-primary">Sửa</button>
          </Link>
          <button
            type="button"
            onClick={() => handleDelete(row._id)}
            className="btn btn-danger "
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

export default Users;
