import React from "react";
import Header from "../../Components/Header";
import Edit from "../Components/User/EditUser";
import Sidebar from "../Components/sidebar";
import { useParams } from "react-router-dom";

const EditUserScreen = () => {
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

export default EditUserScreen;
