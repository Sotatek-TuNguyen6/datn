import React from "react";
import AddCategoryMain from "../../Components/Category/AddCategory";
import Sidebar from "../../Components/sidebar";
import Header from "../../Components/Header";

const AddCategory = () => {
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <AddCategoryMain />
      </main>
    </>
  );
};

export default AddCategory;
