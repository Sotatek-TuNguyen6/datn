import React from "react";
import Sidebar from "../../Components/sidebar";
import Header from "../../Components/Header";
import ReviewMain from "../../Components/Review/ReviewMain";

const MessageScreen = () => {
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <ReviewMain />
      </main>
    </>
  );
};

export default MessageScreen;
