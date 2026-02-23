-- Main Sales Table
CREATE TABLE sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT,
  customer_phone TEXT,
  imei TEXT,
  final_settled_price DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on sales" ON sales FOR ALL USING (true) WITH CHECK (true);

-- Sale Items Table (The "Breakdown")
CREATE TABLE sale_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES inventory(id),
  product_name TEXT NOT NULL, -- Snapshot of name in case it's deleted from inventory
  unit_sale_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on sale_items" ON sale_items FOR ALL USING (true) WITH CHECK (true);

-- RPC Function for Stock Management
CREATE OR REPLACE FUNCTION decrement_stock(row_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE inventory
  SET stock = stock - 1
  WHERE id = row_id AND stock > 0;
END;
$$ LANGUAGE plpgsql;