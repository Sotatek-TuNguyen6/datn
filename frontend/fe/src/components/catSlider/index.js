import React, { useEffect, useRef, useState, useContext } from "react";
import Slider from "react-slick";
import "./style.css";
import { Link } from "react-router-dom";

import { MyContext } from "../../App";
const CatSlider = (props) => {
  const { data, product } = props;
  const [allData, setAllData] = useState(data);
  const [totalLength, setTotalLength] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});

  const context = useContext(MyContext);

  const [itemBg, setItemBg] = useState([
    "#fffceb",
    "#ecffec",
    "#feefea",
    "#fff3eb",
    "#fff3ff",
    "#f2fce4",
    "#feefea",
    "#fffceb",
    "#feefea",
    "#ecffec",
    "#feefea",
    "#fff3eb",
    "#fff3ff",
    "#f2fce4",
    "#feefea",
    "#fffceb",
    "#feefea",
    "#ecffec",
  ]);

  const slider = useRef();

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 10,
    slidesToScroll: 1,
    fade: false,
    arrows: true,
    autoplay: true,
    centerMode: true,
  };

  var catLength = 0;
  var lengthArr = [];
  useEffect(() => {
    if (allData?.length !== 0 && product?.length !== 0) {
      const counts = allData?.reduce((acc, category) => {
        const productCount = product.filter(
          (p) => p.categoryId === category._id
        ).length;
        acc[category._id] = productCount;
        return acc;
      }, {});
      setCategoryCounts(counts);
    }
  }, [allData, product]);

  return (
    <>
      <div className="catSliderSection">
        <div className="container-fluid" ref={slider}>
          <h2 className="hd">Featured Categories</h2>
          <Slider
            {...settings}
            className="cat_slider_Main"
            id="cat_slider_Main"
          >
            {allData?.length !== 0 &&
              allData?.map((item, index) => {
                return (
                  <div className="item" key={index}>
                    <Link to={`/category/${item._id}`}>
                      <div
                        className="info"
                        style={{ background: itemBg[index] }}
                      >
                        <img src={item.image} width="80" />
                        <h5 className="text-capitalize mt-3">
                          {item.categoryName}
                        </h5>
                        <p>{categoryCounts[item._id]} items</p>
                      </div>
                    </Link>
                  </div>
                );
              })}
          </Slider>
        </div>
      </div>
    </>
  );
};

export default CatSlider;
