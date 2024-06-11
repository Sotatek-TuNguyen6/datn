import React from "react";
import Header from "../../Components/Header";
import Main from "../Components/Home/Main";
import Sidebar from "../Components/sidebar";

const HomeScreen = () => {
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

export default HomeScreen;