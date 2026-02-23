export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  stock: number;
  cost_price: number;
  sale_price: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductDto {
  name: string;
  brand: string;
  category: string;
  stock: number;
  cost_price: number;
  sale_price: number;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}