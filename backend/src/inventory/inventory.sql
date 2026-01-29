-- Run this SQL in Supabase Dashboard > SQL Editor to create the inventory table

CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255),
  category VARCHAR(100) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  cost_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  sale_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read inventory
CREATE POLICY "Allow authenticated read access" ON inventory
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to insert inventory
CREATE POLICY "Allow authenticated insert access" ON inventory
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy to allow authenticated users to update inventory
CREATE POLICY "Allow authenticated update access" ON inventory
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to delete inventory
CREATE POLICY "Allow authenticated delete access" ON inventory
  FOR DELETE
  TO authenticated
  USING (true);

-- Add some sample data
INSERT INTO inventory (name, brand, category, stock, cost_price, sale_price) VALUES
  ('iPhone 15 Pro', 'Apple', 'Mobile', 50, 999.00, 1199.00),
  ('Samsung Galaxy S24', 'Samsung', 'Mobile', 35, 899.00, 1099.00),
  ('AirPods Pro', 'Apple', 'Accessories', 100, 199.00, 249.00),
  ('Samsung Galaxy Buds', 'Samsung', 'Accessories', 80, 149.00, 179.00),
  ('iPad Air', 'Apple', 'Tablet', 25, 599.00, 749.00);
