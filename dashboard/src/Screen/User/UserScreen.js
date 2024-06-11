import React from "react";
import Header from "../../Components/Header";
import Sidebar from "../../Components/sidebar";
import UserMain from "../../Components/User/Usermain";

const UserScreen = () => {
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <UserMain />
      </main>
    </>
  );
};

export default UserScreen;
