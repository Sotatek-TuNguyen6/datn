import React from "react";
import Sidebar from "../../Components/sidebar";
import MainProducts from "../../Components/Product/Main";
import Header from "../../Components/Header";

const ProductScreen = () => {
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <MainProducts />
      </main>
    </>
  );
};

export default ProductScreen;