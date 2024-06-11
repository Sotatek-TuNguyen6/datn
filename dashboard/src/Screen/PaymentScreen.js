import React from "react";
import PaymentMain from "../Components/Payment/PaymentMain";
import Sidebar from "../Components/sidebar";
import Header from "../Components/Header";

const PaymentScreen = () => {
    return (
        <>
            <Sidebar />
            <main className="main-wrap">
                <Header />
                <PaymentMain />
            </main>
        </>
    );
};

export default PaymentScreen;