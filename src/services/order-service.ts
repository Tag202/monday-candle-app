import { ORDER_LIMITS } from "../config/constants";
import { CreateOrderDTO, CreateOrderResponseDTO } from "../types/order.types";
import MondayService from "./monday-service";
import { getFragrancesBySlugs } from "./fragrance-service";
import { BadRequestError } from "../errors/bad-request-error";
import { NotFoundError } from "../errors/not-found-error";
import logger from '../utils/logger';

const moduleName = "order-service";

export const createOrder = async (data: CreateOrderDTO, userId?: string): Promise<CreateOrderResponseDTO> => {
    logger.info(`Starting the process of creating order: ${JSON.stringify(data)}`, {moduleName});

    const { firstName, lastName, fragranceSlugs, kitsAmount } = data;

    if (!firstName || !lastName) {
        logger.error(`Error - missing customer name. data: ${JSON.stringify(data)}`, {moduleName});

        throw new BadRequestError("Missing customer name")
    }

    if (!Array.isArray(fragranceSlugs)) {
        logger.error(`Error - fragranceSlugs must be an array. data: ${JSON.stringify(data)}`, {moduleName});

        throw new BadRequestError("FragranceSlugs must be an array")
    }

    if (fragranceSlugs.length !== ORDER_LIMITS.FRAGRANCES_PER_BOX) {
        logger.error(`Error - Exactly ${ORDER_LIMITS.FRAGRANCES_PER_BOX} fragrances must be selected. data: ${JSON.stringify(data)}`, {moduleName});

        throw new BadRequestError(`Exactly ${ORDER_LIMITS.FRAGRANCES_PER_BOX} fragrances must be selected`)
    }

    const fragrances = await getFragrancesBySlugs(fragranceSlugs);
    if (fragrances.length !== ORDER_LIMITS.FRAGRANCES_PER_BOX) {
        logger.error(`Error - One or more fragrances not found. data: ${JSON.stringify(data)}`, {moduleName});

        throw new NotFoundError("One or more fragrances not found");
    }

    if (!kitsAmount || kitsAmount <= 0) {
        logger.error(`Error - kitsAmount must be a positive number. data: ${JSON.stringify(data)}`, {moduleName});

        throw new BadRequestError("kitsAmount must be a positive number");
    }

    const token = process.env.MONDAY_API_TOKEN!;
    if (!token) {
        logger.error(`Error - MONDAY_API_TOKEN is missing. data: ${JSON.stringify(data)}`, {moduleName});

        throw new BadRequestError("MONDAY_API_TOKEN is missing");
    }

    const boardId = Number(process.env.MONDAY_BOARD_ID);
    if (!boardId) {
        logger.error(`Error - MONDAY_BOARD_ID is missing. data: ${JSON.stringify(data)}`, {moduleName});

        throw new BadRequestError("MONDAY_BOARD_ID is missing");
    }

    const groupId = process.env.MONDAY_GROUP_ID!;
    if (!groupId) {
        logger.error(`Error - MONDAY_GROUP_ID is missing. data: ${JSON.stringify(data)}`, {moduleName});

        throw new BadRequestError("MONDAY_GROUP_ID is missing");
    }

    const itemName = `${firstName} ${lastName} - ${kitsAmount} kits`;

    // extract column ids
    const columns = await MondayService.getBoardColumns(token, boardId);

    const firstNameColumn = columns.find(c => c.title === "First Name");
    const lastNameColumn = columns.find(c => c.title === "Last Name");
    const kitsColumn = columns.find(c => c.title === "Kits");
    const fragrancesColumn = columns.find(c => c.title === "Fragrances");
    const createdByColumn = columns.find(c => c.title === "Created By");

    if (!firstNameColumn || !lastNameColumn || !kitsColumn || !fragrancesColumn) {
        logger.error(`Error - Required Monday board columns are missing(First Name, Last Name, Kits, Fragrances, Created By). data: ${JSON.stringify(data)}`, {moduleName});

        throw new BadRequestError("Required Monday board columns are missing");
    }

    const columnValues: Record<string, any> = {
        [firstNameColumn.id]: firstName,
        [lastNameColumn.id]: lastName,
        [kitsColumn.id]: kitsAmount,
        [fragrancesColumn.id]: fragrances.map(f => f.display_name).join(", ")
    };
    if (userId) {
        columnValues[createdByColumn.id] = {
            personsAndTeams: [{ id: Number(userId), kind: "person" }]
        };
    }

    const itemId = await MondayService.createOrderItem(
        token,
        boardId,
        groupId,
        itemName,
        columnValues
    );

    return {itemId};
};