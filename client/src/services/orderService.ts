import getAPIBase from "./baseService";
import mondaySdk from "monday-sdk-js";
import { CreateOrderDTO } from "../types/order.types";


const monday = mondaySdk();

export const createOrder = async (order: CreateOrderDTO) => {
  const token = await monday.get("sessionToken");

  const res = await fetch(`${getAPIBase()}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
       Authorization: token.data,
    },
    body: JSON.stringify(order),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create order");
  }

  return res.json();
};