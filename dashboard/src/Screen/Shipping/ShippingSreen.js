import React from "react";
import Sidebar from "../../Components/sidebar";
import Header from "../../Components/Header";
import ShippingMain from "../../Components/Shipping/ShippingMain";

const ShippingScreen = () => {
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <ShippingMain />
      </main>
    </>
  );
};

export default ShippingScreen;
