export class CreateProductDto {
  name: string;
  brand?: string;
  category: string;
  stock: number;
  cost_price: number;
  sale_price: number;
  total_stock_cost?: number;
}