import React, { useContext, useState } from "react";
import {
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Checkbox
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { resetCart } from "../../features/cart/cartSlice";
import { formatMoneyVND } from "../../functions/formatVND";
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Checkout = () => {
  const user = useSelector((state) => state.user);
  const { listCart } = useSelector((state) => state.cart);
  const dispatch = useDispatch()
  const [formFields, setFormFields] = useState({
    name: user.name,
    pincode: "10000",
    address: "",
    phoneNumber: user.phone,
    paymentMethod: "credit_card",
  });
  const [addresses, setAddresses] = useState(user.addresses);
  const [selectedAddresses, setSelectedAddresses] = useState([]);

  const handleChangeInput = (index, event) => {
    const newAddresses = [...addresses];
    newAddresses[index] = event.target.value;
    setAddresses(newAddresses);
  };

  const handleAddAddress = () => {
    setAddresses([...addresses, ""]);
  };

  const handleCheckboxChange = (index) => {
    if (selectedAddresses.includes(index)) {
      setSelectedAddresses(selectedAddresses.filter((i) => i !== index));
    } else {
      setSelectedAddresses([...selectedAddresses, index]);
    }
  };

  const totalAmount = listCart
    ?.map((item) => parseInt(item.priceSale) * item.quantity)
    .reduce((total, value) => total + value, 0);

  const placeOrder = () => {

    if (
      formFields.name === "" ||
      selectedAddresses.length === 0 ||
      formFields.pincode === "" ||
      formFields.phoneNumber === ""
    ) {
      toast.error('All fields are required', {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        className: "custom-toast",
      });
      // console.log("All fields are required");
      return false;
    }
    const orderDetails = listCart.map((item) => ({
      productId: item._id,
      quantity: item.quantity,
    }));

    createPaymentUrl(orderDetails);
  };

  const changeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createPaymentUrl = async (orderDetails) => {
    const headers = {
      Authorization: `Bearer ${user.access_token}`,
    };
    if (formFields.paymentMethod == "credit_card") {
      const { data } = await axios.post("http://localhost:8000/api/v1/order", {
        userId: user.id,
        amount: totalAmount,
        bankCode: "NCB",
        language: "vn",
        orderDetails: orderDetails,
        addresses: selectedAddresses
      }, {
        headers
      });
      if (data.code === "00") {
        window.location.href = data.data;
      }
    }
    else {
      await axios.post("http://localhost:8000/api/v1/order/create", {
        userId: user.id,
        amount: totalAmount,
        bankCode: "NCB",
        language: "vn",
        orderDetails: orderDetails,
        addresses
      }, {
        headers
      });
    }

    //clear cart ...
    dispatch(resetCart())
  };

  return (
    <>
      <ToastContainer />

      <section className="cartSection mb-5 checkoutPage">
        <div className="container">
          {listCart.length === 0 ? (
            <div className="text-center">
              <h3>Your cart is empty. Please go shopping!</h3>
              <Button variant="contained" color="primary" href="/">
                Go Shopping
              </Button>
            </div>
          ) : (
            <form>
              <div className="row">
                <div className="col-md-8">
                  <div className="form w-75 mt-4 shadow">
                    <h3>Shopping Address</h3>
                    <div className="form-group mb-3 mt-4">
                      <TextField
                        label="Enter Full Name"
                        variant="outlined"
                        className="w-100"
                        value={formFields.name}
                        onChange={changeInput}
                        name="name"
                      />
                    </div>
                    <div className="form-group mb-3">
                      <TextField
                        label="Enter Pincode"
                        variant="outlined"
                        className="w-100"
                        value={formFields.pincode}
                        onChange={changeInput}
                        name="pincode"
                      />
                    </div>
                    <div className="form-group mb-3">
                      <TextField
                        label="Enter Phone Number."
                        variant="outlined"
                        className="w-100"
                        value={formFields.phoneNumber}
                        onChange={changeInput}
                        name="phoneNumber"
                      />
                    </div>
                    {addresses.map((address, index) => (
                      <div key={index} className="form-group d-flex align-items-center">
                        <TextField
                          label={`Enter Full Address ${index + 1}`}
                          variant="outlined"
                          className="w-100"
                          multiline
                          value={address}
                          onChange={(event) => handleChangeInput(index, event)}
                          name={`address${index}`}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedAddresses.includes(index)}
                              onChange={() => handleCheckboxChange(index)}
                              name={`checkbox${index}`}
                            />
                          }
                          label=""
                        />
                      </div>
                    ))}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddAddress}
                      startIcon={<AddIcon />}
                    >
                      Add Address
                    </Button>
                    <div className="form-group mt-2">
                      <FormControl component="fieldset" className="w-100">
                        <FormLabel component="legend">Payment Method</FormLabel>
                        <RadioGroup
                          aria-label="payment method"
                          name="paymentMethod"
                          value={formFields.paymentMethod}
                          onChange={changeInput}
                        >
                          <FormControlLabel
                            value="credit_card"
                            control={<Radio />}
                            label="VNPAY"
                          />
                          <FormControlLabel
                            value="cod"
                            control={<Radio />}
                            label="Cash on Delivery"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </div>
                </div>

                <div className="col-md-4 cartRightBox pt-4">
                  <div className="card p-4 card-noStick">
                    <div className="d-flex align-items-center mb-4">
                      <h5 className="mb-0 text-light">Subtotal</h5>
                      <h3 className="ml-auto mb-0 font-weight-bold">
                        <span className="text-g">{formatMoneyVND(totalAmount)}</span>
                      </h3>
                    </div>

                    <div className="d-flex align-items-center mb-4">
                      <h5 className="mb-0 text-light">Shipping</h5>
                      <h3 className="ml-auto mb-0 font-weight-bold">
                        <span>Free</span>
                      </h3>
                    </div>

                    <div className="d-flex align-items-center mb-4">
                      <h5 className="mb-0 text-light">Total</h5>
                      <h3 className="ml-auto mb-0 font-weight-bold">
                        <span className="text-g">{formatMoneyVND(totalAmount)}</span>
                      </h3>
                    </div>

                    <Button className="btn-g btn-lg" onClick={placeOrder}>
                      Place Order
                    </Button>
                  </div>

                  {/* Add Voucher Code Input Below Order Summary */}
                  <div className="card p-4 mt-4 card-noStick">
                    <div className="form-group mt-3">
                      <TextField
                        label="Enter Voucher Code"
                        variant="outlined"
                        className="w-100"
                        value={formFields.voucherCode}
                        onChange={changeInput}
                        name="voucherCode"
                      />
                      <Button
                        variant="contained"
                        color="secondary"
                        // onClick={applyVoucherCode}
                        className="mt-2"
                      >
                        Apply Voucher
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );

};

export default Checkout;
