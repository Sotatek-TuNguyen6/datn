import React, { useEffect, useState } from "react";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/LoadingError";
import Orders from "./Orders";
import { useSelector } from "react-redux";
import * as OrderService from "../../Services/OrderSevice";
import { useGetListShipping, useGetListUser } from "../../hooks/callApiCache";
const OrderMain = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tempData, setTempData] = useState([]);
  const [search, setSearch] = useState("");
  const user = useSelector((state) => state.user)

  const getListShippingQuery = useGetListShipping(user.access_token);
  const { data, isLoading, isError } = getListShippingQuery

  const getListQuery = useGetListUser();
  const { data: users, isLoading: isLoadingUsers, isError: isErrorUsers } = getListQuery;

  const handleGetAll = async () => {
    setLoading(true);
    const access_token = localStorage.getItem("access_token");
    await OrderService.getAll(JSON.parse(access_token))
      .then((res) => {
        setLoading(false);
        setTempData(res);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  };
  const calculateTotals = (order) => {
    const totalQuantity = order.products.reduce((sum, product) => sum + product.quantity, 0);
    const totalPrice = order.products.reduce((sum, product) => sum + (product.quantity * product.price), 0);
    return { totalQuantity, totalPrice };
  };

  useEffect(() => {
    if (search === "") {
      handleGetAll();
    } else {
      const result = tempData.filter((product) => {
        const values = Object.values(product).join().toLowerCase();
        return values.includes(search.toLowerCase());
      });
      setTempData(result);
    }
  }, [search]);

  const mergeOrdersWithUsers = () => {
    if (tempData.length > 0 && users && users.length > 0 && data && data.length > 0) {
      return tempData.map(order => {

        const user = users.find(user => {
          return user._id === order.userId
        })
        const shipping = data?.find(shipping => {
          return shipping.orderId = order._id
        })
        const { totalQuantity, totalPrice } = calculateTotals(order);

        return {
          ...order,
          userName: user ? user.name : 'Unknown User',
          userPhone: user ? user.phone : '',
          shippingId: shipping ? shipping._id : '',
          totalQuantity,
          totalPrice
        };
      });
    }
    return tempData;
  };

  const mergedData = mergeOrdersWithUsers();

  return (
    <section className="content-main">
      <div className="content-header">
        <h2 className="content-title">Đơn đặt hàng</h2>
      </div>

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            {loading || isLoadingUsers ? (
              <Loading />
            ) : error || isErrorUsers ? (
              <Message variant="alert-danger">{error || 'Failed to load users'}</Message>
            ) : (
              <Orders data={mergedData} search={search} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderMain;