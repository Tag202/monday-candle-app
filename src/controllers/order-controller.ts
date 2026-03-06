import { Request, Response, NextFunction } from "express";

import { HTTP_STATUS } from "../config/http-status";
import * as OrderService from "../services/order-service";
import logger from '../utils/logger';


const moduleName = "order-controller";

export const createOrder = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        logger.info(`POST request received to create order with body: ${req.body}`, {moduleName});

        const userId: string = req.session?.userId;
        const result = await OrderService.createOrder(req.body, userId);

        logger.info(`Successfully created order with body: ${req.body}. result: ${result}`, {moduleName});

        res.status(HTTP_STATUS.CREATED).json(result);
    } catch (error) {
        logger.error(`Error occurred while processing POST order with body: ${JSON.stringify(req.body)}. Error: ${error}`, {moduleName});

        next(error);
    }
};