import React, { useState } from "react";
import MessageError from "../LoadingError/Error";
import Loading from "../LoadingError/LoadingError";
import Review from "./Review";
import { error } from "jquery";
import { Link } from "react-router-dom";
import { useGetListReview } from "../../hooks/callApiCache";
const ReviewMain = () => {
    const [search, SetSearch] = useState("");

    const getListQuery = useGetListReview();

    const { data, isLoading, isError } = getListQuery
    return (
        <>
            <section className="content-main">
                <div className="content-header">
                    <h2 className="content-title">Bình luận</h2>
                    <div>
                        <Link to="/review/create" className="btn btn-primary">
                            Thêm mới
                        </Link>
                    </div>
                </div>

                <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <div className="table-responsive">
                            {isLoading ? (
                                <Loading />
                            ) : isError ? (
                                <MessageError variant="alert-danger">{error}</MessageError>
                            ) : (
                                <Review data={data.data} search={search} />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ReviewMain;
