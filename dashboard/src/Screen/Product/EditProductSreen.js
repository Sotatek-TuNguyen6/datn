import React from "react";
import Sidebar from "../../Components/sidebar";
import EditUserMain from "../../Components/Product/EditProduct";
import {  useParams } from "react-router-dom";
import Header from "../../Components/Header";

const EditProductScreen = () => {
  let { id } = useParams();
  //   const productId = location.params.id;
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <EditUserMain id={id} />
      </main>
    </>
  );
};
export default EditProductScreen;
