import React from "react";
import EditMessage from "../../Components/Review/EditReview";
import Sidebar from "../../Components/sidebar";
import { useParams } from "react-router-dom";
import Header from "../../Components/Header";

const EditReviewScreen = () => {
  let { id } = useParams();
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <EditMessage id={id} />
      </main>
    </>
  );
};

export default EditReviewScreen;
