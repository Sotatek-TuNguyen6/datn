import React, { useState } from "react";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/LoadingError";
import { error } from "jquery";
import Users from "./User";
import { useGetListUser } from "../../hooks/callApiCache";
import { Link } from "react-router-dom";
const UserMain = () => {
  ;
  const [search, SetSearch] = useState("");

  const getListQuery = useGetListUser();
  const { data, isLoading, isError } = getListQuery

  return (
    <section className="content-main">
      <div className="content-header">
        <h2 className="content-title">Người dùng</h2>
        <div>
          <Link to="/adduser" className="btn btn-primary">
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
              <Message variant="alert-danger">{error}</Message>
            ) : (
              <Users data={data} search={search} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserMain;
