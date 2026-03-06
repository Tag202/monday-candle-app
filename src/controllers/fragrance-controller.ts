import { Request, Response, NextFunction } from "express";

import * as fragranceService from "../services/fragrance-service";
import { HTTP_STATUS } from "../config/http-status";
import logger from '../utils/logger';
import { CreateFragranceDTO, FragranceResponseDTO, UpdateFragranceDTO } from "../types/fragrance.types";


const moduleName = "fragrance-controller";

export const getAll = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('GET request received to fetch all fragrances', {moduleName});

    const data: FragranceResponseDTO[] = await fragranceService.getAllFragrances();
    logger.info(`Successfully fetched ${data.length ? data.length: 0} fragrances`, {moduleName});
    res.json(data);
  } catch (error) {
    logger.error(`Error occurred while processing GET request to fetch all fragrances. Error: ${error}`, {moduleName});

    next(error);
  }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info(`GET request received to fetch fragrance with ID: ${req.params.id}`, {moduleName});

    const fragrance: FragranceResponseDTO = await fragranceService.getFragranceById(req.params.id);

    if (!fragrance) {
      logger.error(`Error occurred while processing GET fragrance with ID: ${req.params.id}. Fragrance not found`, {moduleName});
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Fragrance not found" });
    }

    logger.info(`Successfully fetched fragrance with ID: ${req.params.id}`, {moduleName});

    res.json(fragrance);
  } catch (error) {
    logger.error(`Error occurred while processing GET fragrance with ID: ${req.params.id}. Error: ${error}`, {moduleName});

    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info(`POST request received to create new fragrance with body: ${JSON.stringify(req.body)}`, {moduleName});

    const fragrance: CreateFragranceDTO = await fragranceService.createFragrance(req.body);
    logger.info(`Successfully created new fragrance with body: ${JSON.stringify(req.body)}`, {moduleName});

    res.status(HTTP_STATUS.CREATED).json(fragrance);
  } catch (error) {
      // duplicate error
      if (error.code === "23505") {
        logger.error(`Error occurred while processing POST fragrance with body: ${JSON.stringify(req.body)}. Fragrance with this name already exists`, {moduleName});

        return res.status(HTTP_STATUS.DUPLICATE).json({
          error: "Fragrance with this name already exists"
        });
      }
      
      logger.error(`Error occurred while processing POST fragrance with body: ${JSON.stringify(req.body)}. Error: ${error}`, {moduleName});

      next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info(`PUT request received to update fragrance with ID: ${req.params.id}, body: ${JSON.stringify(req.body)}`, {moduleName});

    const id = Number(req.params.id);

    const fragrance: UpdateFragranceDTO | undefined = await fragranceService.updateFragrance(
      id,
      req.body
    );

    if (!fragrance) {
      logger.error(`Error occurred while processing PUT fragrance with ID: ${req.params.id}, body: ${JSON.stringify(req.body)}. Fragrance not found`, {moduleName});

      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Fragrance not found" });
    }

    logger.info(`Successfully updated fragrance with ID: ${req.params.id}, body: ${JSON.stringify(req.body)}`, {moduleName});

    res.json(fragrance);
  } catch (error) {
    logger.error(`Error occurred while processing PUT fragrance with ID: ${req.params.id}, body: ${JSON.stringify(req.body)}. Error: ${error}`, {moduleName});

    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info(`DELETE request received to delete fragrance with ID: ${req.params.id}`, {moduleName});

    const id = Number(req.params.id);

    const deleted: boolean = await fragranceService.deleteFragrance(id);

    if (!deleted) {
      logger.error(`Error occurred while processing DELETE fragrance with ID: ${req.params.id}. Fragrance not found`, {moduleName});

      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Fragrance not found" });
    }

    logger.info(`Successfully deleted fragrance with ID: ${req.params.id}`, {moduleName});
    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    logger.error(`Error occurred while processing DELETE fragrance with ID: ${req.params.id}. Error: ${error}`, {moduleName});

    next(error);
  }
};