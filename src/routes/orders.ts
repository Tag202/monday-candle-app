import { Router } from "express";
import { createOrder } from "../controllers/order-controller";
import authenticationMiddleware from "../middlewares/authentication";

const router = Router();

// POST /api/orders
router.post("/", async (req, res, next) => {
    const auth = req.headers.authorization
    if (auth && auth != "undefined") {
        return authenticationMiddleware(req, res, () => createOrder(req, res, next));
    }
    return createOrder(req, res, next);
});

export default router;