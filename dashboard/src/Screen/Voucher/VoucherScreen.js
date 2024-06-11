import React from "react";
import VoucherMain from "../../Components/Voucher/VoucherMain";
import Sidebar from "../../Components/sidebar";
import Header from "../../Components/Header";

const VoucherScreen = () => {
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <VoucherMain />
      </main>
    </>
  );
};

export default VoucherScreen;
