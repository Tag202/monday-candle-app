// Shared base type
interface OrderBase {
  firstName: string;
  lastName: string;
  fragranceSlugs: string[];
  kitsAmount: number;
}

// DTOs
export type CreateOrderDTO = OrderBase;

export type UpdateOrderDTO = Partial<OrderBase>;

export interface CreateOrderResponseDTO {
  itemId: string;
}