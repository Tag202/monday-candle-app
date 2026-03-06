import * as fragranceService from "../../../src/services/fragrance-service";
import { pool } from "../../../src/services/db";


jest.mock("../../../src/services/db", () => ({
  pool: {
    query: jest.fn()
  }
}));

describe("Fragrances Service", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockFragrances = [
    { id: 1, display_name: "Vanilla", slug: "vanilla" },
    { id: 2, display_name: "Amber", slug: "amber" },
    { id: 3, display_name: "Cedar", slug: "cedar" }
  ];


  it("should return fragrances when slugs exist", async () => {

    (pool.query as jest.Mock).mockResolvedValue({
      rows: mockFragrances
    });

    const result = await fragranceService.getFragrancesBySlugs([
      "vanilla",
      "amber",
      "cedar"
    ]);

    expect(result).toEqual(mockFragrances);

    expect(pool.query).toHaveBeenCalledTimes(1);

  });


  it("should return empty array when no fragrances found", async () => {

    (pool.query as jest.Mock).mockResolvedValue({
      rows: []
    });

    const result = await fragranceService.getFragrancesBySlugs([
      "not-existing"
    ]);

    expect(result).toEqual([]);

  });


  it("should handle empty slug array", async () => {

    const result = await fragranceService.getFragrancesBySlugs([]);

    expect(result).toEqual([]);

    expect(pool.query).not.toHaveBeenCalled();

  });


  it("should throw error when database query fails", async () => {

    (pool.query as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    await expect(
      fragranceService.getFragrancesBySlugs(["vanilla"])
    ).rejects.toThrow("Database error");

  });

  it("should create fragrance successfully", async () => {

    const newFragrance = {
      display_name: "Rose",
      slug: "rose",
      price: 20.00,
      stock_quantity: 50
    };

    (pool.query as jest.Mock).mockResolvedValue({
      rows: [{ id: 4, ...newFragrance }]
    });

    const result = await fragranceService.createFragrance(newFragrance);

    expect(result).toEqual({
      id: 4,
      ...newFragrance
    });

    expect(pool.query).toHaveBeenCalledTimes(1);

  });


  it("should throw error when creating fragrance fails", async () => {

    (pool.query as jest.Mock).mockRejectedValue(
      new Error("Insert failed")
    );

    await expect(
      fragranceService.createFragrance({
        display_name: "Rose",
        price: 20.00,
        stock_quantity: 50
      })
    ).rejects.toThrow("Insert failed");

  });

  it("should update fragrance successfully", async () => {

    const updatedFragrance = {
      id: 1,
      display_name: "Vanilla Updated",
      slug: "vanilla"
    };

    (pool.query as jest.Mock).mockResolvedValue({
      rows: [updatedFragrance]
    });

    const result = await fragranceService.updateFragrance(1, {
      display_name: "Vanilla Updated"
    });

    expect(result).toEqual(updatedFragrance);

    expect(pool.query).toHaveBeenCalledTimes(1);

  });

  it("should return undefined when updating non-existing fragrance", async () => {

    (pool.query as jest.Mock).mockResolvedValue({
      rows: []
    });

    const result = await fragranceService.updateFragrance(999, {
      display_name: "Test"
    });

    expect(result).toBeUndefined();

  });

  it("should delete fragrance successfully", async () => {

    (pool.query as jest.Mock).mockResolvedValue({
      rowCount: 1
    });

    const result = await fragranceService.deleteFragrance(1);

    expect(result).toBe(true);

    expect(pool.query).toHaveBeenCalledTimes(1);

  });


  it("should return false when deleting non-existing fragrance", async () => {

    (pool.query as jest.Mock).mockResolvedValue({
      rowCount: 0
    });

    
    const result = await fragranceService.deleteFragrance(999);

    expect(result).toBe(false);

  });

});