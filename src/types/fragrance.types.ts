// Shared base type
interface FragranceBase {
  display_name: string;
  description?: string | null;
  category?: string | null;
  price: number;
  stock_quantity: number;
  image_url?: string | null;
}

// ENTITY - DB representation
export interface Fragrance extends FragranceBase {
  id: number;
  slug: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// DTOs
export type CreateFragranceDTO = FragranceBase;

export type UpdateFragranceDTO = Partial<FragranceBase>;

export type FragranceResponseDTO = Pick<
  Fragrance,
  "id" | "slug" | "display_name" | "category" | "price" | "stock_quantity" | "is_active"
>;