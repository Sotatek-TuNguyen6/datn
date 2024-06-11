import React from "react";
import AddProductMain from "../../Components/Product/AddProduct";
import Sidebar from "../../Components/sidebar";
import Header from "../../Components/Header";

const AddProduct = () => {
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <AddProductMain />
      </main>
    </>
  );
};

export default AddProduct;