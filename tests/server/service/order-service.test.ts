import { createOrder } from "../../../src/services/order-service";
import { BadRequestError } from "../../../src/errors/bad-request-error";

import MondayService from "../../../src/services/monday-service";
import { getFragrancesBySlugs } from "../../../src/services/fragrance-service";
import { NotFoundError } from "../../../src/errors/not-found-error";

jest.mock("../../../src/services/monday-service");
jest.mock("../../../src/services/fragrance-service");


describe("Order Service", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  })

  const mockColumns = [
    { id: "first_name", title: "First Name" },
    { id: "last_name", title: "Last Name" },
    { id: "kits", title: "Kits" },
    { id: "fragrances", title: "Fragrances" }
  ];

  const mockFragrances = [
    { display_name: "Vanilla" },
    { display_name: "Amber" },
    { display_name: "Cedar" }
  ];

  it("should create an order successfully with valid input", async () => {

    (getFragrancesBySlugs as jest.Mock).mockResolvedValue(mockFragrances);
    (MondayService.getBoardColumns as jest.Mock).mockResolvedValue(mockColumns);
    (MondayService.createOrderItem as jest.Mock).mockResolvedValue(999);

    const result = await createOrder({
      firstName: "Example",
      lastName: "User",
      fragranceSlugs: ["vanilla", "amber", "cedar"],
      kitsAmount: 2
    });

    expect(result).toEqual({ itemId: 999 });

    expect(getFragrancesBySlugs).toHaveBeenCalledWith([
      "vanilla",
      "amber",
      "cedar"
    ]);

    expect(MondayService.createOrderItem).toHaveBeenCalledTimes(1);

  })

  it("should throw error when customer name is missing", async () => {

    await expect(
      createOrder({
        firstName: "",
        lastName: "",
        fragranceSlugs: ["vanilla", "amber", "cedar"],
        kitsAmount: 1
      })
    ).rejects.toThrow(BadRequestError);

  });


  it("should throw error when fragranceSlugs is not an array", async () => {

    await expect(
      createOrder({
        firstName: "Example",
        lastName: "User",
        fragranceSlugs: null as any,
        kitsAmount: 1
      })
    ).rejects.toThrow(BadRequestError);

  });


  it("should throw error when fragrances count is incorrect", async () => {

    await expect(
      createOrder({
        firstName: "Example",
        lastName: "User",
        fragranceSlugs: ["vanilla"],
        kitsAmount: 1
      })
    ).rejects.toThrow(BadRequestError);

  })


  it("should throw error when kitsAmount is invalid", async () => {

    await expect(
      createOrder({
        firstName: "Example",
        lastName: "User",
        fragranceSlugs: ["vanilla", "amber", "cedar"],
        kitsAmount: 0
      })
    ).rejects.toThrow(BadRequestError);

  });


  it("should throw error when fragrances are not found in DB", async () => {

    (getFragrancesBySlugs as jest.Mock).mockResolvedValue([]);

    await expect(
      createOrder({
        firstName: "Example",
        lastName: "User",
        fragranceSlugs: ["vanilla", "amber", "cedar"],
        kitsAmount: 1
      })
    ).rejects.toThrow(NotFoundError);

  })


  it("should throw error when monday board columns are missing", async () => {

    (getFragrancesBySlugs as jest.Mock).mockResolvedValue(mockFragrances);
    (MondayService.getBoardColumns as jest.Mock).mockResolvedValue([]);

    await expect(
      createOrder({
        firstName: "Example",
        lastName: "User",
        fragranceSlugs: ["vanilla", "amber", "cedar"],
        kitsAmount: 1
      })
    ).rejects.toThrow(BadRequestError);

  });


  it("should handle monday API failure gracefully", async () => {

    (getFragrancesBySlugs as jest.Mock).mockResolvedValue(mockFragrances);
    (MondayService.getBoardColumns as jest.Mock).mockResolvedValue(mockColumns);
    (MondayService.createOrderItem as jest.Mock).mockRejectedValue(
      new Error("Monday API failed")
    )

    await expect(
      createOrder({
        firstName: "John",
        lastName: "Doe",
        fragranceSlugs: ["vanilla", "amber", "cedar"],
        kitsAmount: 2
      })
    ).rejects.toThrow("Monday API failed");
  });

})