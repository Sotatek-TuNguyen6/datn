import React from "react";
import AddVoucherMain from "../../Components/Voucher/AddVoucher";
import Sidebar from "../../Components/sidebar";
import Header from "../../Components/Header";

const AddVoucherScreen = () => {
    return (
        <>
            <Sidebar />
            <main className="main-wrap">
                <Header />
                <AddVoucherMain />
            </main>
        </>
    );
};

export default AddVoucherScreen;
