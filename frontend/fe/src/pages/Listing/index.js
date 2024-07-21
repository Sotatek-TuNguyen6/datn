import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Product from "../../components/product";
import { Button } from "@mui/material";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import { useGetProductByCategory } from "../../hooks/productFetching";
import { useGetCategoryById } from "../../hooks/categoryFetching";

const listFilter = [
  "Price: Low to High",
  "Price: High to Low",
  "Release Date",
  "Avg. Rating"
]
const Listing = (props) => {
  const [isOpenDropDown, setisOpenDropDown] = useState(false);
  const [isOpenDropDown2, setisOpenDropDown2] = useState(false);
  const [titleFilter, setTitleFilter] = useState(listFilter[0]);
  const [data, setData] = useState([]);
  let { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [listProduct, setListProduct] = useState([])
  const [dataBefore, setDataBefore] = useState([])
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(0)
  const [category, setCategory] = useState({})
  const [loading, setLoading] = useState(true)
  const [subCategoryName, setSubCategoryName] = useState('')
  const updateCurrentItems = (page) => {
    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const items = dataBefore.slice(indexOfFirstItem, indexOfLastItem);
    setListProduct(items);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    updateCurrentItems(newPage)
  };

  const getListQuery = useGetProductByCategory(id);
  const getListQueryCategory = useGetCategoryById(id);

  const {
    data: dataProduct,
    isLoading: isLoadingCallApi,
    isError,
  } = getListQuery;

  const { data: dataCategoryDetail } = getListQueryCategory;

  var itemsData = [];

  useEffect(() => {
    if (dataProduct && dataProduct.data && dataCategoryDetail) {
      const filterProduct = dataProduct.data.filter((product) => product.subCategoryName === dataCategoryDetail.data.subCategories[0].subCategoryName)
      setDataBefore(filterProduct)
      switch (titleFilter) {
        case "Price: Low to High":
          console.log(filterProduct.slice(0, itemsPerPage).sort((a, b) => a.priceSale - b.priceSale))
          setListProduct(filterProduct.slice(0, itemsPerPage).sort((a, b) => a.priceSale - b.priceSale));
          break;
        case "Price: High to Low":
          setListProduct(filterProduct.slice(0, itemsPerPage).sort((a, b) => b.priceSale - a.priceSale));

          break;
        case "Release Date":
          setListProduct(filterProduct.slice(0, itemsPerPage).sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate)));
          break;
        case "Avg. Rating":
          setListProduct(filterProduct.slice(0, itemsPerPage).sort((a, b) => a.ratings - b.ratings));

          break;
        default:
          break;

      }
      setTotalPage(Math.ceil(filterProduct.length / itemsPerPage))
    }
    if (dataProduct && dataProduct.data && subCategoryName) {
      const filterProduct = dataProduct.data.filter((product) => product.subCategoryName === subCategoryName)
      setDataBefore(filterProduct)
      setListProduct(filterProduct.slice(0, itemsPerPage))

      setTotalPage(Math.ceil(filterProduct.length / itemsPerPage))
    }
  }, [dataProduct, subCategoryName, dataCategoryDetail, itemsPerPage, titleFilter])

  const productRowRef = useRef(null);

  useEffect(() => {
    if (dataCategoryDetail && dataProduct && Array.isArray(dataCategoryDetail.data.subCategories)) {
      setCategory(dataCategoryDetail.data);

      const updatedSubCategories = dataCategoryDetail.data.subCategories.map(subCategory => {
        const countProducts = dataProduct.data.filter(product =>
          product.categoryId._id === id && product.subCategoryName === subCategory.subCategoryName
        ).length;

        return {
          ...subCategory,
          countProducts
        };
      });

      setCategory(prevCategory => ({
        ...prevCategory,
        subCategories: updatedSubCategories
      }));
      setLoading(false)
    }
  }, [dataCategoryDetail, dataProduct]);

  const scrollToProductRow = () => {
    if (productRowRef.current) {
      productRowRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {

    window.scrollTo(0, 0)
  }, [])

  const filterByBrand = (keyword) => {
    props.data.length !== 0 &&
      props.data.map((item, index) => {
        //page == single cat
        if (props.single === true) {
          item.items.length !== 0 &&
            item.items.map((item_) => {
              item_.products.map((item__, index__) => {
                if (item__.brand.toLowerCase() === keyword.toLowerCase()) {
                  //console.log(item__)
                  itemsData.push({
                    ...item__,
                    parentCatName: item.cat_name,
                    subCatName: item_.cat_name,
                  });
                }
              });
            });
        }
        //page == double cat
        else {
          item.items.length !== 0 &&
            item.items.map((item_, index_) => {
              // console.log(item_.cat_name.replace(/[^A-Za-z]/g,"-").toLowerCase())
              if (
                item_.cat_name.split(" ").join("-").toLowerCase() ==
                id.split(" ").join("-").toLowerCase()
              ) {
                item_.products.map((item__, index__) => {
                  if (item__.brand.toLowerCase() === keyword.toLowerCase()) {
                    itemsData.push({
                      ...item__,
                      parentCatName: item.cat_name,
                      subCatName: item_.cat_name,
                    });
                  }
                });
              }
            });
        }
      });

    const list2 = itemsData.filter(
      (item, index) => itemsData.indexOf(item) === index
    );
    //console.log(itemsData)

    setData(list2);

    window.scrollTo(0, 0);
  };

  const filterByPrice = (minValue, maxValue) => {
    props.data.length !== 0 &&
      props.data.map((item, index) => {
        //page == single cat
        if (props.single === true) {
          if (id === item.cat_name.toLowerCase()) {
            item.items.length !== 0 &&
              item.items.map((item_) => {
                item_.products.length !== 0 &&
                  item_.products.map((product, prodIndex) => {
                    let price = parseInt(
                      product.price.toString().replace(/,/g, "")
                    );
                    if (minValue <= price && maxValue >= price) {
                      itemsData.push({
                        ...product,
                        parentCatName: item.cat_name,
                        subCatName: item_.cat_name,
                      });
                    }
                  });
              });
          }
        } else {
          item.items.length !== 0 &&
            item.items.map((item_, index_) => {
              if (
                item_.cat_name.split(" ").join("-").toLowerCase() ==
                id.split(" ").join("-").toLowerCase()
              ) {
                item_.products.map((product) => {
                  let price = parseInt(
                    product.price.toString().replace(/,/g, "")
                  );
                  if (minValue <= price && maxValue >= price) {
                    itemsData.push({
                      ...product,
                      parentCatName: item.cat_name,
                      subCatName: item_.cat_name,
                    });
                  }
                });
              }
            });
        }
      });

    const list2 = itemsData.filter(
      (item, index) => itemsData.indexOf(item) === index
    );
    setData(list2);
  };

  const filterByRating = (keyword) => {
    props.data.length !== 0 &&
      props.data.map((item, index) => {
        //page == single cat
        if (props.single === true) {
          if (item.cat_name.toLowerCase() == id.toLowerCase()) {
            item.items.length !== 0 &&
              item.items.map((item_) => {
                item_.products.map((item__, index__) => {
                  itemsData.push({
                    ...item__,
                    parentCatName: item.cat_name,
                    subCatName: item_.cat_name,
                  });
                });
              });
          }
        }
        //page == double cat
        else {
          item.items.length !== 0 &&
            item.items.map((item_, index_) => {
              // console.log(item_.cat_name.replace(/[^A-Za-z]/g,"-").toLowerCase())
              if (
                item_.cat_name.split(" ").join("-").toLowerCase() ==
                id.split(" ").join("-").toLowerCase()
              ) {
                item_.products.map((item__, index__) => {
                  itemsData.push({
                    ...item__,
                    parentCatName: item.cat_name,
                    subCatName: item_.cat_name,
                  });
                });
              }
            });
        }
      });

    const list2 = itemsData.filter(
      (item, index) => itemsData.indexOf(item) === index
    );

    setData(list2);

    data?.map((item) => {
      if (item.rating === keyword) {
        itemsData.push({
          ...item,
          parentCatName: item.cat_name,
          subCatName: item.cat_name,
        });
      }
    });

    const list3 = itemsData.filter(
      (item, index) => itemsData.indexOf(item) === index
    );

    setData(list2);

    window.scrollTo(0, 0);
  };
  const handleSubCategoryClick = (name) => {
    setSubCategoryName(name);
  };

  useEffect(()=>{

  },[listProduct])
  return (
    <>
      {
        (isLoadingCallApi) ? <div>Loading................</div> : <section className="listingPage">
          <div className="container-fluid">
            {
              <div className="breadcrumb flex-column">
                <h1 className="text-capitalize"> {dataProduct?.data[0]?.categoryId?.categoryName}</h1>
                <ul className="list list-inline mb-0">
                  <li className="list-inline-item">
                    <Link to={"/"}>Home </Link>
                  </li>
                  <li className="list-inline-item">
                    <Link
                      to={`/category/${sessionStorage.getItem("cat")}`}
                      className="text-capitalize"
                    >
                      {sessionStorage.getItem("cat")}
                    </Link>
                  </li>
                  {props.single === false && (
                    <li className="list-inline-item">
                      <Link to={""} class="text-capitalize">
                        {dataProduct?.data[0].categoryId?.categoryName}
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            }

            <div className="listingData">
              <div className="row">
                <div
                  className={`col-md-3 sidebarWrapper click"
                    }`}
                >
                  {!loading && (
                    <Sidebar
                      data={category}
                      filterByBrand={filterByBrand}
                      filterByPrice={filterByPrice}
                      filterByRating={filterByRating}
                      handleSubCategoryClick={handleSubCategoryClick}
                    />
                  )}
                </div>

                <div className="col-md-9 rightContent homeProducts pt-0">
                  <div className="topStrip d-flex align-items-center">
                    <p className="mb-0">
                      We found <span className="text-success">{dataProduct?.data.length}</span>{" "}
                      items for you!
                    </p>
                    <div className="ml-auto d-flex align-items-center">
                      <div className="tab_ position-relative">
                        <Button
                          className="btn_"
                          onClick={() => setisOpenDropDown(!isOpenDropDown)}
                        >
                          <GridViewOutlinedIcon /> Show: {itemsPerPage}
                        </Button>
                        {isOpenDropDown !== false && (
                          <ul className="dropdownMenu">
                            <li>
                              <Button
                                className="align-items-center"
                                onClick={() => {
                                  setisOpenDropDown(false);
                                  setItemsPerPage(5);
                                }}
                              >
                                5
                              </Button>
                            </li>
                            <li>
                              <Button
                                className="align-items-center"
                                onClick={() => {
                                  setisOpenDropDown(false);
                                  setItemsPerPage(10);
                                }}
                              >
                                10
                              </Button>
                            </li>

                            <li>
                              <Button
                                className="align-items-center"
                                onClick={() => {
                                  setisOpenDropDown(false);
                                  setItemsPerPage(15);
                                }}
                              >
                                15
                              </Button>
                            </li>

                            <li>
                              <Button
                                className="align-items-center"
                                onClick={() => {
                                  setisOpenDropDown(false);
                                  setItemsPerPage(20);
                                }}
                              >
                                20
                              </Button>
                            </li>
                          </ul>
                        )}
                      </div>
                      <div className="tab_ ml-3 position-relative">
                        <Button
                          className="btn_"
                          onClick={() => setisOpenDropDown2(!isOpenDropDown2)}
                        >
                          <FilterListOutlinedIcon /> Sort by: {titleFilter}
                        </Button>
                        {isOpenDropDown2 !== false && (
                          <ul className="dropdownMenu">

                            {listFilter.map((item) => <li>
                              <Button
                                className="align-items-center"
                                onClick={() => { setTitleFilter(item); setisOpenDropDown2(false) }}
                              >
                                {item}
                              </Button>
                            </li>)}

                          </ul>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="productRow pl-4 pr-3" ref={productRowRef}>
                    {listProduct.length !== 0 &&
                      listProduct.map((item, index) => {
                        return (
                          <div className="item" key={index}>
                            <Product tag={item.type} item={item} />
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
                              scrollToProductRow();
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
                                scrollToProductRow();
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
                              scrollToProductRow();
                            }}
                          >
                            Next
                          </a>
                        </li>
                      </ul>
                    </nav>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      }
    </>
  );
};

export default Listing;
