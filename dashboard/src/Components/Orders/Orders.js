import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import Table from "../Table/Table";
import * as OrderService from "../../Services/OrderSevice";
import { toast } from "react-toastify";
import Toast from "../LoadingError/Toast";
import { Tooltip } from "react-tooltip";

const Orders = (props) => {
  const { data } = props;
  const columns = [
    {
      name: "Khách hàng",
      selector: (row) => row.userName,

    },
    {
      name: "Tổng giá trị đơn hàng",
      selector: (row) => row.totalPrice,

    },
    {
      name: "Số lượng",
      selector: (row) => row.totalQuantity,
    },
    {
      name: "Trạng thái",
      selector: (row) => row.status,
    },
    {
      name: "Shipping ID",
      selector: (row) => (
        <div>
          <div>
            <Link to="/shipping">{row.shippingId}</Link>
          </div>
          <Tooltip id={`tooltip-${row.shippingId}`} />

        </div>
      ),
    },
    {
      name: "Số điện thoại người mua",
      selector: (row) => (row.phoneCustomer),
    },
    {
      name: "Thời gian mua",
      selector: (row) => (row.createdAt),
    },

    {
      name: "Hành động",
      selector: (row) => (
        <div className="d-flex" style={{ width: "450px" }}>
          <Link
            style={{ marginRight: "5px" }}
          >
            <button className="btn btn-primary">Sửa</button>
          </Link>
          <button
            type="button"
            className="btn btn-danger"
          >
            Xóa
          </button>
        </div>
      ),
    },
  ];

  const ExpandedComponent = ({ data }) => (
    <div style={{ padding: '10px 20px' }}>
      <p><strong>Products:</strong></p>
      <ul style={{ margin: 0, paddingLeft: '20px' }}>
        {data.products.map(product => (
          <li key={product._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <img 
              src={product.mainImage} 
              alt={product.productName} 
              style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }} 
            />
            <div>
              <div><strong>{product.productName}</strong></div>
              <div>Quantity: {product.quantity}</div>
              <div>Price: {product.price}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <>
      <Toast />
      <DataTable
        columns={columns}
        data={data}
        expandableRows
        expandableRowsComponent={ExpandedComponent}
        subHeader
        pagination
        fixedHeader
        fixedHeaderScrollHeight="450px"
        progressComponent={<div>Loading...</div>}

        // subHeaderComponent={
        //   <div>
        //     <input
        //       type="text"
        //       placeholder="Search..."
        //       // Implement search functionality here if needed
        //     />
        //   </div>
        // }
      />
      {/* <Table data={data} columns={columns} sub={true} ExpandedComponent={ExpandedComponent}/> */}
    </>
  );
};

export default Orders;
