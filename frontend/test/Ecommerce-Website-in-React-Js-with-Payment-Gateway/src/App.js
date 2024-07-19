import React, { useEffect, useState, createContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./responsive.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import Home from "./pages/Home/index";
import About from "./pages/About/index";
import Listing from "./pages/Listing";
import NotFound from "./pages/NotFound";
import DetailsPage from "./pages/Details";
import Checkout from "./pages/checkout";
import Cart from "./pages/cart";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Loader from "./assets/images/loading.gif";

import data from "./data";
import { useGetProduct } from "./hooks/productFetching";
import Wishlist from "./pages/Wishlist";
import AccountPage from "./pages/AccountPage/AccountPage";
import MyOrdersPage from "./pages/OrderTracking/order";
import PaymentSuccess from "./pages/PaymentSucces/paymentSucces";
import ChatButton from "./components/Chatbot/ChatButton";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";

const MyContext = createContext();

function App() {
  const getListQuery = useGetProduct();

  const {
    data: dataProduct,
    isLoading: isLoadingCallApi,
    isError,
  } = getListQuery;


  return (
    <>
      {isLoadingCallApi === true ? (
        <div className="loader">
          <img src={Loader} />
        </div>
      ) : (
        <BrowserRouter>
          {/* <MyContext.Provider value={value}> */}
            <Header data={data.productData} />
            <Routes>
              <Route
                exact={true}
                path="/"
                element={<Home data={dataProduct?.data ?? []} />}
              />
              <Route
                exact={true}
                path="/category/:id"
                element={<Listing data={data.productData} single={true} />}
              />
              <Route
                exact={true}
                path="/cat/:id/:id"
                element={<Listing data={data.productData} single={false} />}
              />
              <Route
                exact={true}
                path="/product/:id"
                element={<DetailsPage />}
              />
              <Route exact={true} path="/cart" element={<Cart />} />
              <Route exact={true} path="/wishlist" element={<Wishlist />} />
              <Route exact={true} path="/signIn" element={<SignIn />} />
              <Route exact={true} path="/forgot-password" element={<ForgotPassword />} />
              <Route exact={true} path="/reset-password/:token" element={<ResetPassword />} />
              <Route exact={true} path="/signUp" element={<SignUp />} />
              <Route exact={true} path="/checkout" element={<Checkout />} />
              <Route exact={true} path="/account" element={<AccountPage />} />
              <Route exact={true} path="/orderSuccess" element={<PaymentSuccess />} />
              <Route
                exact={true}
                path="/order-tracking"
                element={<MyOrdersPage />}
              />
              <Route exact={true} path="*" element={<NotFound />} />
            </Routes>
            <Footer />
            <ChatButton/>
          {/* </MyContext.Provider> */}
        </BrowserRouter>
      )}
    </>
  );
}

export default App;

export { MyContext };
