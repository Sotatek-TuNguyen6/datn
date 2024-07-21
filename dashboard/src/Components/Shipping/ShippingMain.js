import React, { useState, useEffect } from "react";
import MessageError from "../LoadingError/Error";
import Loading from "../LoadingError/LoadingError";
import { error } from "jquery";
import { useSelector } from 'react-redux';
import { useGetListShipping, useGetListUser } from "../../hooks/callApiCache";
import Shipping from "./Shipping";
const ReviewMain = () => {
    const [search, SetSearch] = useState("");
    const user = useSelector((state) => state.user)
    const [mappedData, setMappedData] = useState([]);
    const getListQuery = useGetListShipping(user.access_token);
    const getListUser = useGetListUser(user.access_token);
    const { data: dataUser } = getListUser
    const { data, isLoading, isError } = getListQuery

    useEffect(() => {
        if (dataUser && data) {
            const mapped = data.map(item => {
              const user = dataUser.find(user => user._id === item.userId);
              return {
                ...item,
                userName: user ? user.name : 'Unknown User',
              };
            });
            setMappedData(mapped);
          }
    }, [dataUser, data])

    return (
        <>
            <section className="content-main">
                <div className="content-header">
                    <h2 className="content-title">Shipping</h2>
                </div>

                <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <div className="table-responsive">
                            {isLoading ? (
                                <Loading />
                            ) : isError ? (
                                <MessageError variant="alert-danger">{error}</MessageError>
                            ) : (
                                <Shipping data={mappedData} search={search} />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ReviewMain;
