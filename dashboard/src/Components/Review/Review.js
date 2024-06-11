import React, { useState } from "react";
import { Link } from "react-router-dom";
import Table from "../Table/Table";
import * as MessageService from "../../Services/MessageService";
import { toast } from "react-toastify";
import Toast from "../LoadingError/Toast";

const Review = (props) => {
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

        await MessageService.deletePay(id)
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
      name: "User",
      selector: (row) => row.authorName,
    },
    {
      name: "Product",
      selector: (row) => row.product,
    },
    {
      name: "Rating",
      selector: (row) => row.rating,
    },
    {
      name: "Comment",
      selector: (row) => row.body,
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="d-flex" style={{ width: "450px" }}>
          <Link
            to={`/review/${row._id}/edit`}
            style={{ marginRight: "5px" }}
          >
            <button className="btn btn-primary">Edit</button>
          </Link>
          <button
            type="button"
            onClick={() => handleDelete(row._id)}
            className="btn btn-danger"
          >
            Delete
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

export default Review;
