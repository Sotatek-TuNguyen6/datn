import React from "react";
import Edit from "../Components/Payment/EditPayment";
import Sidebar from "../Components/sidebar";
import { useParams } from "react-router-dom";
import Header from "../Components/Header";

const EditPaymentScreen = () => {
  let { id } = useParams();
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <Edit id={id} />
      </main>
    </>
  );
};

export default EditPaymentScreen;
