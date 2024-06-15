import React from "react";
import { Link } from "react-router-dom";
import Loading from "../LoadingError/LoadingError";
import * as ProductService from "../../Services/ProductService";
import Table from "../Table/Table";
import { toast } from "react-toastify";
import Toast from "./../LoadingError/Toast";
import { useGetListProduct } from "../../hooks/callApiCache";
import { Tooltip } from '@reach/tooltip';
import '@reach/tooltip/styles.css';

const MainProducts = () => {
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
  const options = {
    maximumFractionDigits: 0,
  };
  const formattedAmount = (amount, options) => {
    return amount.toLocaleString(undefined, options);
  };
  const handleDelete = async (id) => {
    if (id) {
      if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
        await ProductService.deleteProduct(id)
          .then((res) => {
            if (!toast.isActive(toastId.current)) {
              toastId.current = toast.success("Thành công!", Toastobjects);
            }
            // hangldeGetAll();
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
      name: "Ảnh",
      selector: (row) => (
        <img
          src={row.mainImage}
          // alt={row.title}
          class="img-thumbnail"
          style={{ maxWidth: "50%" }}
        />
      ),
    },
    {
      name: "Tên sản phẩm",
      selector: (row) => row.productName,
    },
    {
      name: "Mô tả",
      selector: (row) => (
        <Tooltip label={row.description}>
          <span>
            {row.description.length > 30 ? `${row.description.substring(0, 30)}...` : row.description}
          </span>
        </Tooltip>
      ),
    },
    {
      name: "Danh mục",
      selector: (row) => row.categoryName,
    },
    {
      name: "Giá gốc",
      selector: (row) => formattedAmount(row.price),
    },
    {
      name: "Giá Sale",
      selector: (row) => row.priceSale,
    },
    {
      name: "Đánh giá",
      selector: (row) => row.ratings,
    },
    {
      name: "Số lượng tồn kho",
      selector: (row) => row.stockQuantity,
    },
    {
      name: "Hành động",
      selector: (row) => (
        <>
          <Link
            to={`/product/${row._id}/edit`}
            className=" pb-3 col-md-6"
          >
            <button className="btn btn-warning">Sửa</button>
          </Link>
          <Link
            style={{ marginLeft: "10px" }}
            onClick={() => handleDelete(row._id)}
            className=" pb-3 col-md-6"
          >
            <button className="btn btn-danger">Xóa</button>
          </Link>
        </>
      ),
    },
  ];
  const getListQuery = useGetListProduct();

  const { data, isLoading, error } = getListQuery

  return (
    <>
      <Toast />
      <section className="content-main">
        <div className="content-header">
          <h2 className="content-title">Sản phẩm</h2>
          <div>
            <Link to="/addproduct" className="btn btn-primary">
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

export default MainProducts;
