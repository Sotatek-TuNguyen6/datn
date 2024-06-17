import React, { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Rating from "@mui/material/Rating";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";
import Slider from "react-slick";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Button } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import Product from "../../components/product";
import { MyContext } from "../../App";
import { useGetProductDetail } from "../../hooks/productFetching";
import Loader from "../../assets/images/loading.gif";
import { useGetReview } from "../../hooks/reviewFetching";
import { useDispatch, useSelector } from "react-redux";
import * as ReviewService from "../../services/Review/reviewService";
import * as ActionsService from "../../services/Actions/actionService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as UserService from "../../services/UserService/index";
import { updateUser } from "../../features/userSlice/userSlice";
import { addToCart } from "../../features/cart/cartSlice";
import { formatMoneyVND } from "../../functions/formatVND";

const DetailsPage = (props) => {
  const [bigImageSize, setBigImageSize] = useState([1500, 1500]);
  const [smlImageSize, setSmlImageSize] = useState([150, 150]);
  const [activeSize, setActiveSize] = useState(0);
  const [activeTabs, setActiveTabs] = useState(0);
  const [currentProduct, setCurrentProduct] = useState({});
  const context = useContext(MyContext);
  const [prodCat, setProdCat] = useState({
    parentCat: sessionStorage.getItem("parentCat"),
    subCatName: sessionStorage.getItem("subCatName"),
  });
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [rating, setRating] = useState(0.0);
  const [isAlreadyAddedInCart, setisAlreadyAddedInCart] = useState(false);
  const [body, setBody] = useState("");
  const dispatch = useDispatch();
  const { id: idUser, name, access_token } = useSelector((state) => state.user);

  const zoomSliderBig = useRef();
  const zoomSlider = useRef();

  let { id } = useParams();

  const getListQuery = useGetProductDetail(id);
  const getListReview = useGetReview(id);
  const { data: detailProduct, isLoading, error } = getListQuery;
  const {
    data: dataReview,
    isLoading: isLoadingReview,
    error: errorReview,
  } = getListReview;

  const navigate = useNavigate();
  const mutationAddActions = useMutation({
    mutationFn: (data) => ActionsService.createAction(data),
    onSuccess: () => {
      alert("Action created successfully");
    },
    onError: (error) => {
      console.error("Error submitting action:", error);
    },
  });

  useEffect(() => {
    if (id && idUser) {
      mutationAddActions.mutate({
        userId: idUser,
        productId: id,
        actionType: "watching",
      });
    }
    window.scrollTo(0, 0);
  }, [id, idUser]);

  useEffect(() => {
    if (error && error.message === "NOT_FOUND") {
      navigate("/not-found");
    }
  }, [error, navigate]);

  var settings2 = {
    dots: false,
    infinite: false,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: false,
    arrows: false,
  };

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    fade: false,
    arrows: context.windowWidth > 992 ? true : false,
  };

  var related = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    fade: false,
    arrows: context.windowWidth > 992 ? true : false,
  };

  const goto = (index) => {
    zoomSlider.current.slickGoTo(index);
    zoomSliderBig.current.slickGoTo(index);
  };

  const isActive = (index) => {
    setActiveSize(index);
  };
  const queryClient = useQueryClient();
  const mutationAddReview = useMutation({
    mutationFn: ({ data, token }) => ReviewService.createReview(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries(["review", id]);
    },
    onError: (error) => {
      console.error("Error submitting review:", error);
    },
  });

  const handleGetDetailsUser = async (id, accessToken) => {
    const header = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    try {
      const userDetails = await UserService.getDetailUser(id, header);

      dispatch(updateUser({ ...userDetails, access_token: accessToken }));
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  const mutationAddWishlist = useMutation({
    mutationFn: ({ wishlist }) =>
      UserService.addWishlist(wishlist, access_token),
    onSuccess: () => {
      handleGetDetailsUser(idUser, access_token);
    },
    onError: (error) => {
      console.error("Error submitting review:", error);
    },
  });

  const handleAddWishList = (item) => {
    mutationAddWishlist.mutate({ wishlist: item._id });
  };
  const submitReview = async (e) => {
    e.preventDefault();

    const bodyReq = {
      authorName: name,
      authorId: idUser,
      product: id,
      body,
      rating,
    };
    mutationAddReview.mutate({ data: bodyReq, token: access_token });
  };

  var reviews_Arr2 = [];

  const handleAddToCart = (item) => {
    dispatch(addToCart({ ...item, quantity: 1 }));
    mutationAddActions.mutate({
      userId: idUser,
      productId: id,
      actionType: "add_to_cart",
    });
  };

  return (
    <>
      {context.windowWidth < 992 && (
        <Button
          className={`btn-g btn-lg w-100 filterBtn {isAlreadyAddedInCart===true && 'no-click'}`}
          onClick={() => handleAddToCart(detailProduct?.data)}
        >
          <ShoppingCartOutlinedIcon />
          {"Add To Cart"}
        </Button>
      )}

      {isLoading && (
        <div className="loader">
          <img src={Loader} />
        </div>
      )}
      <section className="detailsPage mb-5">
        {context.windowWidth > 992 && (
          <div className="breadcrumbWrapper mb-4">
            <div className="container-fluid">
              <ul className="breadcrumb breadcrumb2 mb-0">
                <li>
                  <Link>Home</Link>{" "}
                </li>
                <li>
                  <Link
                    to={`/cat/${prodCat.parentCat
                      .split(" ")
                      .join("-")
                      .toLowerCase()}`}
                    onClick={() =>
                      sessionStorage.setItem(
                        "cat",
                        prodCat.parentCat.split(" ").join("-").toLowerCase()
                      )
                    }
                    className="text-capitalize"
                  >
                    {prodCat.parentCat}
                  </Link>{" "}
                </li>

                <li>
                  <Link
                    to={`/cat/${prodCat.parentCat.toLowerCase()}/${prodCat.subCatName
                      .replace(/\s/g, "-")
                      .toLowerCase()}`}
                    onClick={() =>
                      sessionStorage.setItem(
                        "cat",
                        prodCat.subCatName.toLowerCase()
                      )
                    }
                    className="text-capitalize"
                  >
                    {prodCat.subCatName}
                  </Link>{" "}
                </li>
                <li>{detailProduct?.data?.productName}</li>
              </ul>
            </div>
          </div>
        )}

        <div className="container detailsContainer pt-3 pb-3">
          <div className="row">
            {/* productZoom code start here */}
            <div className="col-md-5">
              <div className="productZoom">
                <Slider
                  {...settings2}
                  className="zoomSliderBig"
                  ref={zoomSliderBig}
                >
                  {detailProduct?.data?.images !== undefined &&
                    detailProduct?.data?.images.map((imgUrl, index) => {
                      return (
                        <div className="item">
                          <InnerImageZoom
                            zoomType="hover"
                            zoomScale={1}
                            src={`${imgUrl}?im=Resize=(${bigImageSize[0]},${bigImageSize[1]})`}
                          />
                        </div>
                      );
                    })}
                </Slider>
              </div>

              <Slider {...settings} className="zoomSlider" ref={zoomSlider}>
                {detailProduct?.data?.images !== undefined &&
                  detailProduct?.data?.images.map((imgUrl, index) => {
                    return (
                      <div className="item">
                        <img
                          src={`${imgUrl}?im=Resize=(${smlImageSize[0]},${smlImageSize[1]})`}
                          className="w-100"
                          onClick={() => goto(index)}
                        />
                      </div>
                    );
                  })}
              </Slider>
            </div>
            {/* productZoom code ends here */}

            {/* product info code start here */}
            <div className="col-md-7 productInfo">
              <h1>{detailProduct?.data?.productName}</h1>
              <div className="d-flex align-items-center mb-4 mt-3">
                <Rating
                  name="half-rating-read"
                  value={parseFloat(detailProduct?.data?.ratings)}
                  precision={0.5}
                  readOnly
                />
                <span className="text-light ml-2">
                  ({dataReview?.data.length} reviews)
                </span>
              </div>

              <div className="priceSec d-flex align-items-center mb-3">
                <span className="text-g priceLarge">
                  $ {formatMoneyVND(detailProduct?.data?.priceSale)}
                </span>
                <div className="ml-3 d-flex flex-column">
                  <span className="text-org">
                    {(
                      ((detailProduct?.data?.price -
                        detailProduct?.data?.priceSale) /
                        detailProduct?.data?.price) *
                      100
                    ).toFixed(2)}
                    % Off
                  </span>
                  <span className="text-light oldPrice">
                    $ {formatMoneyVND(detailProduct?.data?.price)}
                  </span>
                </div>
              </div>

              <div>
                <p
                  dangerouslySetInnerHTML={{
                    __html: detailProduct?.data?.description,
                  }}
                ></p>
              </div>
              {detailProduct?.data?.weight !== undefined &&
                detailProduct?.data?.weight.length !== 0 && (
                  <div className="productSize d-flex align-items-center">
                    <span>Size / Weight:</span>
                    <ul className="list list-inline mb-0 pl-4">
                      {currentProduct.weight.map((item, index) => {
                        return (
                          <li className="list-inline-item">
                            <a
                              className={`tag ${
                                activeSize === index ? "active" : ""
                              }`}
                              onClick={() => isActive(index)}
                            >
                              {item}g
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

              {detailProduct?.data?.RAM !== undefined &&
                detailProduct?.data?.RAM.length !== 0 && (
                  <div className="productSize d-flex align-items-center">
                    <span>RAM:</span>
                    <ul className="list list-inline mb-0 pl-4">
                      {detailProduct?.data?.RAM.map((RAM, index) => {
                        return (
                          <li className="list-inline-item">
                            <a
                              className={`tag ${
                                activeSize === index ? "active" : ""
                              }`}
                              onClick={() => isActive(index)}
                            >
                              {RAM} GB
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

              {detailProduct?.data?.SIZE !== undefined &&
                detailProduct?.data?.SIZE.length !== 0 && (
                  <div className="productSize d-flex align-items-center">
                    <span>SIZE:</span>
                    <ul className="list list-inline mb-0 pl-4">
                      {detailProduct?.data?.SIZE.map((SIZE, index) => {
                        return (
                          <li className="list-inline-item">
                            <a
                              className={`tag ${
                                activeSize === index ? "active" : ""
                              }`}
                              onClick={() => isActive(index)}
                            >
                              {SIZE}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

              <div className="d-flex align-items-center">
                <div className="d-flex align-items-center">
                  {context.windowWidth > 992 && (
                    <Button
                      className={`btn-g btn-lg addtocartbtn ${
                        isAlreadyAddedInCart === true && "no-click"
                      }`}
                      onClick={() => handleAddToCart(detailProduct?.data)}
                    >
                      <ShoppingCartOutlinedIcon />
                      {"Add To Cart"}
                    </Button>
                  )}
                  <Button
                    className=" btn-lg addtocartbtn  ml-3  wishlist btn-border"
                    onClick={() => handleAddWishList(detailProduct?.data)}
                  >
                    <FavoriteBorderOutlinedIcon />{" "}
                  </Button>
                  {/* <Button className=' btn-lg addtocartbtn ml-3 btn-border'><CompareArrowsIcon /></Button> */}
                </div>
              </div>
            </div>
            {/* product info code ends here */}
          </div>

          <div className="card mt-5 p-5 detailsPageTabs">
            <div className="customTabs">
              <ul className="list list-inline">
                <li className="list-inline-item">
                  <Button
                    className={`${activeTabs === 0 && "active"}`}
                    onClick={() => {
                      setActiveTabs(0);
                    }}
                  >
                    Description
                  </Button>
                </li>
                <li className="list-inline-item">
                  <Button
                    className={`${activeTabs === 1 && "active"}`}
                    onClick={() => {
                      setActiveTabs(1);
                    }}
                  >
                    Additional info
                  </Button>
                </li>
                <li className="list-inline-item">
                  <Button
                    className={`${activeTabs === 2 && "active"}`}
                    onClick={() => {
                      setActiveTabs(2);
                    }}
                  >
                    Reviews ({dataReview?.data?.length})
                  </Button>
                </li>
              </ul>

              <br />

              {activeTabs === 0 && (
                <div>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: detailProduct?.data?.description,
                    }}
                  ></p>
                </div>
              )}

              {activeTabs === 1 && (
                <div className="tabContent">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <tbody>
                        <tr class="stand-up">
                          <th>Stand Up</th>
                          <td>
                            <p>35″L x 24″W x 37-45″H(front to back wheel)</p>
                          </td>
                        </tr>
                        <tr class="folded-wo-wheels">
                          <th>Folded (w/o wheels)</th>
                          <td>
                            <p>32.5″L x 18.5″W x 16.5″H</p>
                          </td>
                        </tr>
                        <tr class="folded-w-wheels">
                          <th>Folded (w/ wheels)</th>
                          <td>
                            <p>32.5″L x 24″W x 18.5″H</p>
                          </td>
                        </tr>
                        <tr class="door-pass-through">
                          <th>Door Pass Through</th>
                          <td>
                            <p>24</p>
                          </td>
                        </tr>
                        <tr class="frame">
                          <th>Frame</th>
                          <td>
                            <p>Aluminum</p>
                          </td>
                        </tr>
                        <tr class="weight-wo-wheels">
                          <th>Weight (w/o wheels)</th>
                          <td>
                            <p>20 LBS</p>
                          </td>
                        </tr>
                        <tr class="weight-capacity">
                          <th>Weight Capacity</th>
                          <td>
                            <p>60 LBS</p>
                          </td>
                        </tr>
                        <tr class="width">
                          <th>Width</th>
                          <td>
                            <p>24″</p>
                          </td>
                        </tr>
                        <tr class="handle-height-ground-to-handle">
                          <th>Handle height (ground to handle)</th>
                          <td>
                            <p>37-45″</p>
                          </td>
                        </tr>
                        <tr class="wheels">
                          <th>Wheels</th>
                          <td>
                            <p>12″ air / wide track slick tread</p>
                          </td>
                        </tr>
                        <tr class="seat-back-height">
                          <th>Seat back height</th>
                          <td>
                            <p>21.5″</p>
                          </td>
                        </tr>
                        <tr class="head-room-inside-canopy">
                          <th>Head room (inside canopy)</th>
                          <td>
                            <p>25″</p>
                          </td>
                        </tr>
                        <tr class="pa_color">
                          <th>Color</th>
                          <td>
                            <p>Black, Blue, Red, White</p>
                          </td>
                        </tr>
                        <tr class="pa_size">
                          <th>Size</th>
                          <td>
                            <p>M, S</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTabs === 2 && !isLoadingReview && (
                <div className="tabContent">
                  <div className="row">
                    <div className="col-md-8">
                      <h3>Customer questions & answers</h3>
                      <br />

                      {dataReview?.data?.length !== 0 &&
                        dataReview?.data !== undefined &&
                        dataReview?.data?.map((item, index) => {
                          return (
                            <div
                              className="card p-4 reviewsCard flex-row"
                              key={index}
                            >
                              <div className="image">
                                <div className="rounded-circle">
                                  <img src="https://wp.alithemes.com/html/nest/demo/assets/imgs/blog/author-2.png" />
                                </div>
                                <span className="text-g d-block text-center font-weight-bold">
                                  {item.authorName}
                                </span>
                              </div>

                              <div className="info pl-5">
                                <div className="d-flex align-items-center w-100">
                                  <h5 className="text-light">
                                    {item.createdDate}
                                  </h5>
                                  <div className="ml-auto">
                                    <Rating
                                      name="half-rating-read"
                                      value={parseFloat(item.rating)}
                                      precision={0.5}
                                      readOnly
                                    />
                                  </div>
                                </div>

                                <p>{item.body} </p>
                              </div>
                            </div>
                          );
                        })}

                      <br className="res-hide" />

                      <br className="res-hide" />

                      {idUser ? (
                        <form className="reviewForm" onSubmit={submitReview}>
                          <h4>Add a review</h4>
                          <br />
                          <div className="form-group">
                            <textarea
                              className="form-control"
                              placeholder="Write a Review"
                              name="review"
                              value={body}
                              onChange={(e) => setBody(e.target.value)}
                            />
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                <Rating
                                  name="rating"
                                  value={rating}
                                  precision={0.5}
                                  onChange={(e) => setRating(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          <br />
                          <div className="form-group">
                            <Button type="submit" className="btn-g btn-lg">
                              Submit Review
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div>Please log in to add a review</div>
                      )}
                    </div>

                    <div className="col-md-4 pl-5 reviewBox">
                      <h4>Customer reviews</h4>

                      <div className="d-flex align-items-center mt-2">
                        <Rating
                          name="half-rating-read"
                          defaultValue={4.5}
                          precision={0.5}
                          readOnly
                        />
                        <strong className="ml-3">4.8 out of 5</strong>
                      </div>

                      <br />

                      <div className="progressBarBox d-flex align-items-center">
                        <span className="mr-3">5 star</span>
                        <div
                          class="progress"
                          style={{ width: "85%", height: "20px" }}
                        >
                          <div
                            class="progress-bar bg-success"
                            style={{ width: "75%", height: "20px" }}
                          >
                            75%
                          </div>
                        </div>
                      </div>

                      <div className="progressBarBox d-flex align-items-center">
                        <span className="mr-3">4 star</span>
                        <div
                          class="progress"
                          style={{ width: "85%", height: "20px" }}
                        >
                          <div
                            class="progress-bar bg-success"
                            style={{ width: "50%", height: "20px" }}
                          >
                            50%
                          </div>
                        </div>
                      </div>

                      <div className="progressBarBox d-flex align-items-center">
                        <span className="mr-3">3 star</span>
                        <div
                          class="progress"
                          style={{ width: "85%", height: "20px" }}
                        >
                          <div
                            class="progress-bar bg-success"
                            style={{ width: "55%", height: "20px" }}
                          >
                            55%
                          </div>
                        </div>
                      </div>

                      <div className="progressBarBox d-flex align-items-center">
                        <span className="mr-3">2 star</span>
                        <div
                          class="progress"
                          style={{ width: "85%", height: "20px" }}
                        >
                          <div
                            class="progress-bar bg-success"
                            style={{ width: "35%", height: "20px" }}
                          >
                            35%
                          </div>
                        </div>
                      </div>

                      <div className="progressBarBox d-flex align-items-center">
                        <span className="mr-3">1 star</span>
                        <div
                          class="progress"
                          style={{ width: "85%", height: "20px" }}
                        >
                          <div
                            class="progress-bar bg-success"
                            style={{ width: "25%", height: "20px" }}
                          >
                            25%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <br />

          <div className="relatedProducts homeProductsRow2  pt-5 pb-4">
            <h2 class="hd mb-0 mt-0">Related products</h2>
            <br className="res-hide" />
            <Slider {...related} className="prodSlider">
              {relatedProducts.length !== 0 &&
                relatedProducts.map((product, index) => {
                  return (
                    <div className="item" key={index}>
                      <Product tag={product.type} item={product} />
                    </div>
                  );
                })}
            </Slider>
          </div>
        </div>
      </section>
    </>
  );
};

export default DetailsPage;
