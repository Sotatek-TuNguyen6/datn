import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Card, CardContent, Typography, Button } from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { resetCart } from "../../features/cart/cartSlice";

const PaymentSuccess = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const user = useSelector((state) => state.user);

  const transactionId = queryParams.get("vnp_TxnRef");
  const amount = queryParams.get("vnp_Amount") / 100;
  const responseCode = queryParams.get("vnp_ResponseCode");
  const message = responseCode === "00" ? "Transaction Successful" : "Transaction Failed";

  const dispatch = useDispatch()
  
  useEffect(() => {
    const getResultVNPay = async () => {
      const headers = {
        Authorization: `Bearer ${user.access_token}`,
      };
      const query = location.search;

      try {
        const { data } = await axios.get(`http://localhost:8000/api/v1/order/vnpay_return${query}`, { headers });
        if(data){
          dispatch(resetCart())
        }
        return data;
      } catch (error) {
        console.error('Error fetching VNPay result:', error);
      }
    };

    getResultVNPay();
  }, [location.search, user.access_token]); 
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card style={{ maxWidth: 600, width: "100%", padding: 20 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            Payment Status
          </Typography>
          <Typography variant="body1" component="p">
            {message}
          </Typography>
          <Typography variant="body2" component="p">
            Transaction ID: {transactionId}
          </Typography>
          <Typography variant="body2" component="p">
            Amount: {amount} VND
          </Typography>
          <div style={{ marginTop: 20 }}>
            <Button variant="contained" color="primary" component={Link} to="/">
              Go to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
