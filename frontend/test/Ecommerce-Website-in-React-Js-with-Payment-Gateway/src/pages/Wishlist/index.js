import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Rating from "@mui/material/Rating";
import { Button } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as UserService from "../../services/UserService/index";
import { updateUser } from "../../features/userSlice/userSlice";

const Wishlist = () => {
  const context = useContext(MyContext);
  const history = useNavigate();
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.user);
  const { id, access_token, wishlist } = userLogin;

  useEffect(() => {
    if (!access_token) {
      history("/signIn");
    }
    window.scrollTo(0, 0);
  }, [access_token]);

  function formatMoneyVND(amount) {
    return amount?.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }
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

  const queryClient = useQueryClient();
  const mutationDeleteWishlist = useMutation({
    mutationFn: ({ idProduct }) =>
      UserService.updateWishlist(idProduct, access_token),
    onSuccess: () => {
      handleGetDetailsUser(id, access_token);
    },
    onError: (error) => {
      console.error("Error submitting review:", error);
    },
  });

  const handleDelete = async (idProduct) => {
    mutationDeleteWishlist.mutate({ idProduct });
  };

  return (
    <>
      {context.windowWidth > 992 && (
        <div className="breadcrumbWrapper mb-4">
          <div className="container-fluid">
            <ul className="breadcrumb breadcrumb2 mb-0">
              <li>
                <Link to={"/"}>Home</Link>
              </li>
              <li>Shop</li>
              <li>Wishlist</li>
            </ul>
          </div>
        </div>
      )}

      <section className="cartSection mb-5">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="d-flex align-items-center w-100">
                <div className="left">
                  <h1 className="hd mb-0">Your Wishlist</h1>
                  <p>
                    There are <span className="text-g">{wishlist.length}</span>{" "}
                    products in your Wishlist
                  </p>
                </div>
              </div>

              <div className="cartWrapper mt-4">
                <div className="table-responsive">
                  {wishlist.length === 0 ? (
                    <p>Your wishlist is empty.</p>
                  ) : (
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Unit Price</th>
                          <th>Remove</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wishlist.map((item, index) => (
                          <tr key={index}>
                            <td width={"50%"}>
                              <div className="d-flex align-items-center">
                                <div className="img">
                                  <Link to={`/product/${item._id}`}>
                                    <img
                                      src={
                                        item.mainImage + "?im=Resize=(100,100)"
                                      }
                                      className="w-100"
                                      alt={item.productName}
                                    />
                                  </Link>
                                </div>
                                <div className="info pl-4">
                                  <Link to={`/product/${item._id}`}>
                                    <h4>{item.productName}</h4>
                                  </Link>
                                  <Rating
                                    name="half-rating-read"
                                    value={parseFloat(item.ratings)}
                                    precision={0.5}
                                    readOnly
                                  />
                                  <span className="text-light">
                                    ({parseFloat(item.ratings)})
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td width="20%">
                              <span>{formatMoneyVND(item.priceSale)}</span>
                            </td>
                            <td align="">
                              <span
                                className="cursor"
                                onClick={() => handleDelete(item._id)}
                              >
                                <DeleteOutlineOutlinedIcon />
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              <br />

              <div className="d-flex align-items-center">
                <Link to="/">
                  <Button className="btn-g">
                    <KeyboardBackspaceIcon /> Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Wishlist;
