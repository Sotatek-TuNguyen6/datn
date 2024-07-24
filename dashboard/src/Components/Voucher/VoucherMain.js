import React, { useEffect, useState } from "react";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/LoadingError";
import Voucher from "./Voucher";
import { useSelector } from "react-redux";
import * as VoucherService from "../../Services/VoucherService";
import { error } from "jquery";
import { useGetListVoucher } from "../../hooks/callApiCache";
const VoucherMain = () => {
    const [search, SetSearch] = useState("");

    const getListQuery = useGetListVoucher();

    const { data, isLoading, isError } = getListQuery
    return (
        <>
            <section className="content-main">
                <div className="content-header">
                    <h2 className="content-title">Mã giảm giá</h2>
                </div>

                <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <div className="table-responsive">
                            {isLoading ? (
                                <Loading />
                            ) : isError ? (
                                <Message variant="alert-danger">{isError}</Message>
                            ) : (
                                <Voucher data={data} search={search} />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default VoucherMain;
