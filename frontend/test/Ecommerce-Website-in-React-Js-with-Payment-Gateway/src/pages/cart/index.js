import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Rating from "@mui/material/Rating";
import { Button } from "@mui/material";
import QuantityBox from "../../components/quantityBox";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {  removeFromCart, updateCart } from "../../features/cart/cartSlice";
import { formatMoneyVND } from "../../functions/formatVND";
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const context = useContext(MyContext);
  const history = useNavigate();
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.user);
  const { listCart } = useSelector((state) => state.cart);
  const { access_token } = userLogin;
  useEffect(() => {
    if (!access_token) {
      history("/signIn");
    }

    window.scrollTo(0, 0);
  }, [access_token]);

  const deleteItemCart = (id) => {
    dispatch(removeFromCart(id));
  };

  const updateQuantityCart = (items) => {
    dispatch(updateCart(items[0]));
  };

  const tottalAmount = listCart
    ?.map((item) => parseInt(item.priceSale) * item.quantity)
    .reduce((total, value) => total + value, 0);
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
              <li>Cart</li>
            </ul>
          </div>
        </div>
      )}

      <section className="cartSection mb-5">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8">
              <div className="d-flex align-items-center w-100">
                <div className="left">
                  <h1 className="hd mb-0">Your Cart</h1>
                  <p>
                    There are <span className="text-g">{listCart.length}</span>{" "}
                    products in your cart
                  </p>
                </div>
              </div>

              <div className="cartWrapper mt-4">
                <div className="table-responsive">
                  {listCart.length === 0 ? (
                    <p>Your cart is empty</p>
                  ) : (
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Unit Price</th>
                          <th>Quantity</th>
                          <th>Subtotal</th>
                          <th>Remove</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listCart.map((item, index) => (
                          <tr key={index}>
                            <td width={"50%"}>
                              <div className="d-flex align-items-center">
                                <div className="img">
                                  <Link to={`/product/${item.id}`}>
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
                              <span>{formatMoneyVND(item.priceSale, 1)}</span>
                            </td>
                            <td>
                              <QuantityBox
                                item={item}

                              />
                            </td>
                            <td>
                              <span className="text-g">
                                {formatMoneyVND(item.priceSale, item.quantity)}
                              </span>
                            </td>
                            <td align="center">
                              <span
                                className="cursor"
                                onClick={() => deleteItemCart(item._id)}
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

            {listCart.length > 0 && (
              <div className="col-md-4 cartRightBox">
                <div className="card p-4">
                  <div className="d-flex align-items-center mb-4">
                    <h5 className="mb-0 text-light">Subtotal</h5>
                    <h3 className="ml-auto mb-0 font-weight-bold">
                      <span className="text-g">
                        {formatMoneyVND(tottalAmount, 1)}
                      </span>
                    </h3>
                  </div>

                  <div className="d-flex align-items-center mb-4">
                    <h5 className="mb-0 text-light">Shipping</h5>
                    <h3 className="ml-auto mb-0 font-weight-bold">
                      <span>Free</span>
                    </h3>
                  </div>

                  <div className="d-flex align-items-center mb-4">
                    <h5 className="mb-0 text-light">Estimate for</h5>
                    <h3 className="ml-auto mb-0 font-weight-bold">
                      United Kingdom
                    </h3>
                  </div>

                  <div className="d-flex align-items-center mb-4">
                    <h5 className="mb-0 text-light">Total</h5>
                    <h3 className="ml-auto mb-0 font-weight-bold">
                      <span className="text-g">
                        {formatMoneyVND(tottalAmount, 1)}
                      </span>
                    </h3>
                  </div>

                  <br />
                  <Link to={"/checkout"}>
                    <Button
                      className="btn-g btn-lg"
                      onClick={() => {
                        context.setCartTotalAmount(
                          tottalAmount
                        );
                      }}
                    >
                      Proceed To CheckOut
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;
