import React, { useState, useEffect, useRef, useContext } from "react";
import SliderBanner from "./slider/index";
import CatSlider from "../../components/catSlider";
import Banners from "../../components/banners";
import "./style.css";
import Product from "../../components/product";
import Banner4 from "../../assets/images/banner4.jpg";
import Slider from "react-slick";
import TopProducts from "./TopProducts";
import { MyContext } from "../../App";
import { useGetCategoru } from "../../hooks/categoryFetching";

const Home = (props) => {
  const getListQuery = useGetCategoru();

  const { data, isLoading: isLoadingCallApi, isError } = getListQuery;

  const [activeTab, setactiveTab] = useState("");
  const [activeTabIndex, setactiveTabIndex] = useState(0);
  const [activeTabData, setActiveTabData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [bestSells, setBestSells] = useState([]);
  const [itemsPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(0)
  const [listProduct, setListProduct] = useState([])
  const [topSelling, setTopSelling] = useState([])
  const [Trending, setTrending] = useState([])
  const [recently, setRecently] = useState([])
  const [topRate, setTopRate] = useState([])
  const productRow = useRef();
  const context = useContext(MyContext);

  var settings = {
    dots: false,
    infinite: context.windowWidth < 992 ? false : true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    fade: false,
    arrows: context.windowWidth < 992 ? false : true,
  };

  const updateCurrentItems = (page) => {
    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const items = activeTabData.slice(indexOfFirstItem, indexOfLastItem);
    setListProduct(items);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    updateCurrentItems(newPage)
  };

  useEffect(() => {
    if (activeTab) {
      const filteredData = props.data
        .filter((item) => item.categoryId === activeTab)
        .map((item) => ({
          ...item,
          parentCatName: item.categoryName,
          subCatName: item.categoryName,
        }));
      setListProduct(filteredData.slice(0, 10))
      setActiveTabData(filteredData);
      setIsLoadingProducts(false);
      setTotalPage(Math.ceil(filteredData?.length / itemsPerPage))
      setCurrentPage(1)
    }

  }, [activeTab, props.data]);

  useEffect(() => {
    if (data) {
      setactiveTab(data?.data[0]?._id);
    }
  }, [isLoadingCallApi]);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (props.data && props.data.length > 0) {
      const shuffledData = [...props.data].sort(() => 0.5 - Math.random());
      const shuffledDataSelling = [...props.data].sort(() => 0.5 - Math.random());
      const shuffledDataTrending = [...props.data].sort(() => 0.5 - Math.random());
      const shuffledDataRecently = [...props.data].sort(() => 0.5 - Math.random());
      const shuffledDataRate = [...props.data].sort(() => 0.5 - Math.random());
      const selectedBestSells = shuffledData.slice(0, 10);
      setBestSells(selectedBestSells);
      setTopSelling(shuffledDataSelling.slice(0, 5))
      setTrending(shuffledDataTrending.slice(0, 5))
      setRecently(shuffledDataRecently.slice(0, 5))
      setTopRate(shuffledDataRate.slice(0, 5))
    }
  }, [props.data]);

  return (
    <>
      {isLoadingCallApi ? (
        <div>Loading......</div>
      ) : (
        <div style={{ display: "block" }}>
          <SliderBanner />
          <CatSlider data={data?.data} product={props.data} />

          <Banners />

          <section className="homeProducts homeProductWrapper">
            <div className="container-fluid">
              <div className="d-flex align-items-center homeProductsTitleWrap">
                <h2 className="hd mb-0 mt-0 res-full">Popular Products</h2>
                <ul className="list list-inline ml-auto filterTab mb-0 res-full">
                  {data?.data?.length !== 0 &&
                    data?.data.map((item, index) => {
                      return (
                        <li className="list list-inline-item">
                          <a
                            className={`cursor text-capitalize 
                                                ${activeTabIndex === index
                                ? "act"
                                : ""
                              }`}
                            onClick={() => {
                              setactiveTab(item._id);
                              setactiveTabIndex(index);
                              productRow.current.scrollLeft = 0;
                              setIsLoadingProducts(true);
                            }}
                          >
                            {item.categoryName}
                          </a>
                        </li>
                      );
                    })}
                </ul>
              </div>

              <div
                className={`productRow ${isLoadingProducts === true && "loading"
                  }`}
                ref={productRow}
              >
                {listProduct.length !== 0 &&
                  listProduct.map((item, index) => {
                    return (
                      <div className="item" key={index}>
                        <Product item={item} />
                      </div>
                    );
                  })}

              </div>
              {totalPage > 0 && (
                <nav aria-label="Page navigation example">
                  <ul className="pagination justify-content-center mt-4">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <a
                        className="page-link"
                        href="#"
                        tabIndex="-1"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage - 1);
                        }}
                      >
                        Previous
                      </a>
                    </li>
                    {[...Array(totalPage)].map((_, i) => (
                      <li className={`page-item ${currentPage === i + 1 ? 'active' : ''}`} key={i}>
                        <a
                          className="page-link"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(i + 1);
                          }}
                        >
                          {i + 1} {currentPage === i + 1 && <span className="sr-only">(current)</span>}
                        </a>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPage ? 'disabled' : ''}`}>
                      <a
                        className="page-link"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage + 1);
                        }}
                      >
                        Next
                      </a>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </section >

          <section className="homeProducts homeProductsRow2 pt-0">
            <div className="container-fluid">
              <div className="d-flex align-items-center">
                <h2 className="hd mb-0 mt-0">Daily Best Sells</h2>
              </div>

              <br className="res-hide" />
              <br className="res-hide" />
              <div className="row">
                <div className="col-md-3 pr-5 res-hide">
                  <img src={Banner4} className="w-100" />
                </div>

                <div className="col-md-9">
                  <Slider {...settings} className="prodSlider">
                    {bestSells.length !== 0 &&
                      bestSells.map((item, index) => {
                        return (
                          <div className="item" key={index}>
                            <Product tag={item.type} item={item} />
                          </div>
                        );
                      })}
                  </Slider>
                </div>
              </div>
            </div>
          </section>

          <section className="topProductsSection">
            <div className="container-fluid">
              <div className="row">
                <div className="col">
                  <TopProducts title="Top Selling" data={topSelling} />
                </div>

                <div className="col">
                  <TopProducts title="Trending Products" data={Trending} />
                </div>

                <div className="col">
                  <TopProducts title="Recently added" data={recently} />
                </div>

                <div className="col">
                  <TopProducts title="Top Rated" data={topRate} />
                </div>
              </div>
            </div>
          </section>
        </div >
      )}
    </>
  );
};

export default Home;
