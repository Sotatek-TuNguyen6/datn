import React from "react";
import Sidebar from "./../Components/sidebar";
import OrderMain from "../Components/Orders/OrdersMain";
import Header from "../Components/Header";

const OrderScreen = () => {
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <OrderMain />
      </main>
    </>
  );
};

export default OrderScreen;