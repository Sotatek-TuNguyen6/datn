import React from "react";
import AddVoucher from "../../Components/Voucher/AddVoucher";
import Header from "../../Components/Header";
import Sidebar from "../../Components/sidebar";

const AddReviewScreen = () => {
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <AddVoucher />
      </main>
    </>
  );
};

export default AddReviewScreen;