import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import Table from "../Table/Table";
import * as VoucherService from "../../Services/VoucherService";
import { toast } from "react-toastify";
import Toast from "../LoadingError/Toast";
import Loading from "../LoadingError/LoadingError";

const Voucher = (props) => {
    const { data } = props;
    const [loading, setLoading] = useState("");
    const [tempData, setTempData] = useState([]);

    const [error, setError] = useState("");
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
    // const hangldeGetAll = async () => {
    //     setLoading(true);
    //     await VoucherService.getPay()
    //         .then((res) => {
    //             setLoading(false);
    //             setTempData(res);
    //         })
    //         .catch((error) => {
    //             setError(error);
    //         });
    // };
    const handleDelete = async (id) => {
        if (id) {
            if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
                const access_token = JSON.parse(localStorage.getItem("access_token"));

                await VoucherService.deletePay(id, access_token)
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
    const columns = [
        {
            name: "Mã",
            // selector: (row) => row.order.products[0].name,
            selector: (row) => row.code,
        },
        {
            name: "Khuyến mãi",
            // selector: (row) => row.order.products[0].name,
            selector: (row) => row.discount,
        },
        {
            name: "Thời hạn",
            // selector: (row) => row.order.customerAddress,
            selector: (row) => row.expiryDays,

        },

        {
            name: "Hành động",
            selector: (row) => (
                <div className="d-flex" style={{ width: "450px" }}>
                    <Link
                        to={`/voucher/${row._id}/edit`}
                        style={{ marginRight: "5px" }}
                    // className="btn btn-sm btn-outline-success p-2 pb-3 col-md-6"
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
            <div className="text-end mb-3">
                <Link to="/addvoucher" className="btn btn-primary">Thêm mã giảm giá</Link>
            </div>
            <Table data={data} columns={columns} sub={true} />





        </>
    );
};

export default Voucher;
