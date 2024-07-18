import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Card, CardContent, Typography, Button } from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";

const PaymentSuccess = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const user = useSelector((state) => state.user);

  const transactionId = queryParams.get("vnp_TxnRef");
  const amount = queryParams.get("vnp_Amount") / 100;
  const responseCode = queryParams.get("vnp_ResponseCode");
  const message = responseCode === "00" ? "Transaction Successful" : "Transaction Failed";

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${user.access_token}`,
    };
    const getResultVNPay = async () => {
      const query = location.search;
      const { data } = await axios.get(
        `http://localhost:8000/api/v1/order/vnpay_return${query}`, { headers }
      );
    };

    getResultVNPay();
  }, []);
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
