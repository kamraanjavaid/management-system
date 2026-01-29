// This file is kept for reference
// The actual database schema is managed in Supabase
// Table: inventory
// Columns: id, name, brand, category, stock, cost_price, sale_price, created_at

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  stock: number;
  cost_price: number;
  sale_price: number;
  created_at: string;
}
