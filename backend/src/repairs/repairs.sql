CREATE TABLE repairs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  device_model TEXT NOT NULL,
  imei TEXT,
  issue_description TEXT NOT NULL,
  estimated_cost DECIMAL(10, 2) NOT NULL,
  final_cost DECIMAL(10, 2),
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In-Repair', 'Ready', 'Delivered')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE repairs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on repairs" ON repairs FOR ALL USING (true) WITH CHECK (true);
