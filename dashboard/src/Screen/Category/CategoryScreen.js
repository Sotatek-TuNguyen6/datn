import React from "react";
import Main from "../../Components/Category/Main";
import Sidebar from "../../Components/sidebar";
import Header from "../../Components/Header";

const CategoryScreen = () => {
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <Main />
      </main>
    </>
  );
};

export default CategoryScreen;