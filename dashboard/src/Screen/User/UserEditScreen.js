import React from "react";
import EditUser from "../../Components/User/EditUser";
import Sidebar from "../../Components/sidebar";
import { useParams } from "react-router-dom";
import Header from "../../Components/Header";

const EditUserScreen = () => {
  let { id } = useParams();
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <EditUser id={id} />
      </main>
    </>
  );
};

export default EditUserScreen;
