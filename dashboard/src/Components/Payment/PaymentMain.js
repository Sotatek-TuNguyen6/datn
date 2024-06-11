import React, { useState } from "react";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/LoadingError";
import Payment from "./Payment";

import { error } from "jquery";
import { useGetListPayment } from "../../hooks/callApiCache";
import { useSelector } from "react-redux";
const PaymentMain = () => {

  const { access_token } = useSelector((state) => state.user)
  const [search, SetSearch] = useState("");

  const getListQuery = useGetListPayment(access_token);
  const { data, isLoading, isError } = getListQuery


  return (
    <>
      <section className="content-main">
        <div className="content-header">
          <h2 className="content-title">Thanh toán</h2>
        </div>

        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              {isLoading ? (
                <Loading />
              ) : isError ? (
                <Message variant="alert-danger">{error}</Message>
              ) : (
                <Payment data={data} search={search} />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PaymentMain;
