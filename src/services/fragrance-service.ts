import { pool } from "./db";
import { Fragrance, CreateFragranceDTO, UpdateFragranceDTO, FragranceResponseDTO } from "../types/fragrance.types";

export const getAllFragrances = async (): Promise<FragranceResponseDTO[]> => {
  const result = await pool.query(
    "SELECT * FROM fragrances ORDER BY display_name ASC"
  );
  return result.rows;
};

export const getFragranceById = async (id: string): Promise<FragranceResponseDTO> => {
  const result = await pool.query(
    "SELECT * FROM fragrances WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

export const createFragrance = async (data: CreateFragranceDTO): Promise<CreateFragranceDTO> => {
    const {
        display_name,
        description,
        category,
        price,
        image_url,
        stock_quantity,
    } = data;

    const slug = generate_slug(display_name);

    const result = await pool.query(
      `INSERT INTO fragrances
        (display_name, slug, description, category, price, image_url, stock_quantity)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
      [display_name, slug, description, category, price, image_url, stock_quantity]
    );

  return result.rows[0];
};

export const updateFragrance = async (id: number, data: UpdateFragranceDTO): Promise<UpdateFragranceDTO | undefined> => {
  const {
    display_name,
    description,
    category,
    price,
    image_url,
    stock_quantity,
  } = data;

  const result = await pool.query(
    `UPDATE fragrances
     SET display_name = $1,
         description = $2,
         category = $3,
         price = $4,
         image_url = $5,
         stock_quantity = $6,
         updated_at = NOW()
     WHERE id = $7
     RETURNING *`,
    [
      display_name ?? null, 
      description ?? null, 
      category ?? null, 
      price ?? null, 
      image_url ?? null, 
      stock_quantity ?? null, 
      id]
  );

  return result.rows[0];
};

export const deleteFragrance = async (id: number): Promise<boolean> => {
  const result = await pool.query(
    "DELETE FROM fragrances WHERE id = $1",
    [id]
  );

  return (result.rowCount ?? 0) > 0;
};

export const getFragrancesBySlugs = async (slugs: string[]): Promise<Fragrance[]> => {
  if (!slugs || slugs.length === 0) {
    return [];
  }

  const result = await pool.query(
    `
    SELECT *
    FROM fragrances
    WHERE slug = ANY($1)
    `,
    [slugs]
  );

  return result.rows;
};

 const generate_slug = (name: string) =>
    name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");