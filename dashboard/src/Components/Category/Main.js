import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../LoadingError/LoadingError";
import * as CategoryService from "../../Services/CategoryService";
import Table from "../Table/Table";
import { toast } from "react-toastify";
import Toast from "./../LoadingError/Toast";
import { useQuery } from "react-query";
import { useGetListCategory } from "../../hooks/callApiCache";

const MainCategory = () => {
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
      const access_token = JSON.parse(localStorage.getItem("access_token"));
      if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
        await CategoryService.deleteCategory(id, access_token)
          .then((res) => {
            if (!toast.isActive(toastId.current)) {
              toastId.current = toast.success("Thành công!", Toastobjects);
            }
            // hangldeGetAll();
            setTimeout(() => {
              window.location.reload();
            }, 500);
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
      name: "Danh mục",
      selector: (row) => row.categoryName,
      // sortable: true,
    },
    {
      name: "Thao tác",
      selector: (row) => (
        <>
          {/*<Link*/}
          {/*  to={`/categories/${row._id}/edit`}*/}
          {/*  style={{ marginRight: "5px" }}*/}
          {/*  // className="btn btn-sm btn-outline-success p-2 pb-3 col-md-6"*/}
          {/*>*/}
          {/*  <button className="btn btn-primary">Sửa</button>*/}
          {/*</Link>*/}
          <Link
            style={{ marginLeft: "15px" }}
            onClick={() => handleDelete(row._id)}
          // className="btn btn-sm btn-outline-success p-2 pb-3 col-md-6"
          >
            <button className="btn btn-danger">Xóa</button>
          </Link>
        </>
      ),
    },
  ];
  const getListQuery = useGetListCategory();

  const { data, isLoading, error } = getListQuery

  return (
    <>
      <Toast />
      <section className="content-main">
        <div className="content-header">
          <h2 className="content-title">Danh mục</h2>
          <div>
            <Link to="/addcategory" className="btn btn-primary">
              Thêm mới
            </Link>
          </div>
        </div>

        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            {isLoading ? (
              <Loading />
            ) : (
              <div className="row">
                <Table data={data.data} columns={columns} sub={true} />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default MainCategory;
