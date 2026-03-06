export interface FragranceOption {
  value: string;
  label: string;
}

export interface FragranceResponseDTO {
  display_name: string;
  slug: string;
  description?: string | null;
  category?: string | null;
  price: number;
  stock_quantity: number;
  image_url?: string | null;
}