import React, { useEffect, useState, useContext } from "react";
import "./style.css";
import Rating from "@mui/material/Rating";
import { Button } from "@mui/material";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import * as ActionsService from "../../services/Actions/actionService";
import * as UserService from "../../services/UserService/index";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatMoneyVND } from "../../functions/formatVND";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";
import { useMutation } from "@tanstack/react-query";
import { updateUser } from "../../features/userSlice/userSlice";
import Toast from "../Toast/Toast";

const Product = (props) => {
  const toastId = React.useRef(null);
  const Toastobjects = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };
  const [productData, setProductData] = useState();
  const [isAdded, setIsadded] = useState(false);
  const dispatch = useDispatch()
  const { id: idUser, name, access_token } = useSelector((state) => state.user);

  const history = useNavigate()
  useEffect(() => {
    setProductData(props.item);
  }, [props.item]);

  const setProductCat = () => {
    sessionStorage.setItem("parentCat", productData.categoryName);
    sessionStorage.setItem("subCatName", productData.subCategoryName);
  };

  // const addToCart = (item) => {
  //   context.addToCart(item);
  //   setIsadded(true);
  // };
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
  const mutationAddActions = useMutation({
    mutationFn: (data) => ActionsService.createAction(data),
    onSuccess: () => {

      console.log("Action created successfully");
    },
    onError: (error) => {
      console.error("Error submitting action:", error);
    },
  });
  const mutationAddWishlist = useMutation({
    mutationFn: ({ wishlist }) =>
      UserService.addWishlist(wishlist, access_token),
    onSuccess: () => {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.success("Success!", Toastobjects);
      }
      handleGetDetailsUser(idUser, access_token);
    },
    onError: (error) => {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error("Error!", Toastobjects);
      }
      // console.error("Error submitting review:", error);
    },
  });

  const handleAddWishList = (item) => {
    mutationAddWishlist.mutate({ wishlist: item._id });
  };

  const handleAddToCart = (item) => {
    const { _id } = item
    dispatch(addToCart({ ...item, quantity: 1 }));

    mutationAddActions.mutate({
      userId: idUser,
      productId: _id,
      actionType: "add_to_cart",
    });

    history("/cart")
    // alert("ok")
    // toast.success('Add to cart success!', {
    //   position: "bottom-center",
    //   autoClose: 5000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   progress: undefined,
    //   theme: "dark",
    //   className: "custom-toast",
    //   transition: Bounce,
    // });
  };
  const handleIconClick = (event) => {
    event.stopPropagation();
  };

  return (
    <>
      {/* <Toast /> */}
      <div className="productThumb" onClick={setProductCat}>
        {props.tag !== null && props.tag !== undefined && (
          <span className={`badge ${props.tag}`}>{props.tag}</span>
        )}

        {productData !== undefined && (
          <>
            <Link to={`/product/${productData?._id}`}>
              <div className="imgWrapper">
                <div className="p-4 wrapper mb-3">
                  <img src={productData?.mainImage} className="w-100" />
                </div>

                <div className="overlay transition">
                  <ul className="list list-inline mb-0">
                    <li className="list-inline-item">
                      <a className="cursor" tooltip="Add to Wishlist" onClick={() => { handleAddWishList(productData) }}>
                        <FavoriteBorderOutlinedIcon onClick={handleAddWishList} />
                      </a>
                    </li>
                    {/* <li className="list-inline-item">
                    <a className="cursor" tooltip="Compare">
                      <CompareArrowsOutlinedIcon />
                    </a>
                  </li> */}
                    <li className="list-inline-item">
                      <a className="cursor" tooltip="Quick View">
                        <RemoveRedEyeOutlinedIcon />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </Link>

            <div className="info">
              <span className="d-block catName">{productData?.brand}</span>
              <h4 className="title">
                <Link>{productData?.productName?.substr(0, 50) + "..."}</Link>
              </h4>
              <Rating
                name="half-rating-read"
                value={parseFloat(productData?.ratings)}
                precision={0.5}
                readOnly
              />
              <span className="brand d-block text-g">
                By <Link className="text-g">{productData?.brand}</Link>
              </span>

              <div className="d-flex align-items-center mt-3">
                <div className="d-flex align-items-center w-100">
                  <span className="price text-g font-weight-bold">
                    {formatMoneyVND(productData?.priceSale)}
                  </span>{" "}
                  <span className="oldPrice ml-auto">
                    {formatMoneyVND(productData?.price)}
                  </span>
                </div>
              </div>

              <Button
                className="w-100 transition mt-3"
                onClick={() => handleAddToCart(productData)}
              >
                <ShoppingCartOutlinedIcon />
                {isAdded === true ? "Added" : "Add"}
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Product;
