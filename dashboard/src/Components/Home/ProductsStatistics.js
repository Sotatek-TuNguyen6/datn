import React from "react";

const ProductsStatistics = () => {
  return (
    <div className="col-xl-6 col-lg-12">
      <div className="card mb-4 shadow-sm">
        <article className="card-body">
          <h5 className="card-title">Thống kê sản phẩm</h5>
          <iframe
            style={{
              background: "#FFFFFF",
              border: "none",
              borderRadius: "2px",
              boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2);",
              width: "100%",
              height: "350px",
            }}
            src="https://charts.mongodb.com/charts-thd-shop-bixzq/embed/charts?id=644f2f9a-8d2d-49b9-8c15-84999c15b00e&maxDataAge=3600&theme=light&autoRefresh=true"
          >
          </iframe>
        </article>
      </div>
    </div>
  );
};

export default ProductsStatistics;
