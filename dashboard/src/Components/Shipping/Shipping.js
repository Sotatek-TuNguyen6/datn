import React, { useState } from "react";
import { Link } from "react-router-dom";
import Table from "../Table/Table";
import * as MessageService from "../../Services/MessageService";
import { toast } from "react-toastify";
import Toast from "../LoadingError/Toast";
import { useMutationHooks } from "../../hooks/useMutationHooks";
// import "bootstrap/dist/css/bootstrap.min.css";
import * as ShippingService from "../../Services/ShippingService";
import { useSelector } from 'react-redux';
import { useMutation } from "react-query";

const Shipping = (props) => {
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
    const user = useSelector((state) => state.user)
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const openModal = (item) => {
        setSelectedItem(item);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedItem(null);
    };
    const mutationDelete = useMutation({
        mutationFn: (data) => ShippingService.deleteShipping(data),
        onSuccess: () => {
            if (!toast.isActive(toastId.current)) {
                toastId.current = toast.success("Succes!", Toastobjects);
            }
            window.location.reload();
        },
        onError: (error) => {
            if (!toast.isActive(toastId.current)) {
                toastId.current = toast.error("Error!", Toastobjects);
            }
            // window.location.reload();
        },
    });
    const handleDelete = async (id) => {
        if (id) {
            if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
                mutationDelete.mutate({
                    id,
                    access_token: user.access_token,
                })
            }
        }
    };

    // const mutation = useMutationHooks((data) => {
    //     const { id, access_token, ...rests } = data;
    //     ShippingService.updateShipping(id, rests, access_token);
    // });

    // const mutation = useMutationHooks(
    //     async ({ id, status, destination, access_token }) => {
    //         const data = {
    //             status,
    //             destination
    //         }
    //         return await ShippingService.updateShipping(id, data, access_token);
    //     },
    //     {
    //         onMutate: () => {
    //             setShowLoader(true);
    //         },
    //         onSuccess,
    //         onError,
    //     }
    // );
    const mutation = useMutation({
        mutationFn: (data) => ShippingService.updateShipping(data),
        onSuccess: () => {
            if (!toast.isActive(toastId.current)) {
                toastId.current = toast.success("Succes!", Toastobjects);
            }
            window.location.reload();
        },
        onError: (error) => {
            if (!toast.isActive(toastId.current)) {
                toastId.current = toast.error("Error!", Toastobjects);
            }
            // window.location.reload();
        },
    });
    const handleSave = async () => {
        mutation.mutate({
            id: selectedItem._id,
            status: selectedItem.status,
            destination: selectedItem.destination,
            access_token: user.access_token,
        });

        closeModal();
    };

    const columns = [
        {
            name: "User",
            selector: (row) => row.userName,
        },
        {
            name: "OrderId",
            selector: (row) => row.orderId,
        },
        {
            name: "Status",
            selector: (row) => row.status,
        },
        {
            name: "Destination",
            selector: (row) => row.destination,
        },
        {
            name: "Action",
            selector: (row) => (
                <div className="d-flex" style={{ width: "450px" }}>
                    <button className="btn btn-primary" onClick={() => openModal(row)}>Edit</button>
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
            {modalIsOpen && selectedItem && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Shipping Details</h5>
                                <button type="button" className="close" onClick={closeModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label>Status</label>
                                        <select
                                            className="form-control"
                                            value={selectedItem.status}
                                            onChange={(e) =>
                                                setSelectedItem({ ...selectedItem, status: e.target.value })
                                            }
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="canceled">Cancelled</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Destination</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={selectedItem.destination}
                                            onChange={(e) =>
                                                setSelectedItem({ ...selectedItem, destination: e.target.value })
                                            }
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={handleSave}>
                                    Save
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Shipping;
