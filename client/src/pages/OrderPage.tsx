import React from "react";
import { Box } from "@vibe/core";
import OrderForm from "../components/OrderForm";
import "./OrderPage.css";

const OrderPage = () => {
  return (
    <Box className="order-page">
      <Box className="order-page-container">
        <OrderForm />
      </Box>
    </Box>
  );
};

export default OrderPage;