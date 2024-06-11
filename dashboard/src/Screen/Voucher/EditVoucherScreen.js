import React from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../Components/sidebar";
import Header from "../../Components/Header";
import EditVoucher from "../../Components/Voucher/EditVoucher";

const EditVoucherScreen = () => {
  let { id } = useParams();
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <EditVoucher id={id} />
      </main>
    </>
  );
};

export default EditVoucherScreen;
