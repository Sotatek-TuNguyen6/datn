import React from "react";
import Sidebar from "../../Components/sidebar";
import { useParams } from "react-router-dom";
import Header from "../../Components/Header";
import AddUserMain from "../../Components/User/AddUser";

const AddUserScreen = () => {
  let { id } = useParams();
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <AddUserMain/>
      </main>
    </>
  );
};

export default AddUserScreen;
