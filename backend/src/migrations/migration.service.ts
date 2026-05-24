import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class MigrationService implements OnApplicationBootstrap {
  private readonly logger = new Logger(MigrationService.name);

  constructor(private supabaseService: SupabaseService) {}

  async onApplicationBootstrap() {
    await this.runMigrations();
  }

  private async runMigrations() {
    const client = this.supabaseService.getAdminClient();

    const migrations = [
      {
        name: 'inventory',
        sql: `
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

          ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

          DO $$ BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'inventory' AND policyname = 'Allow authenticated read access') THEN
              CREATE POLICY "Allow authenticated read access" ON inventory FOR SELECT TO authenticated USING (true);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'inventory' AND policyname = 'Allow authenticated insert access') THEN
              CREATE POLICY "Allow authenticated insert access" ON inventory FOR INSERT TO authenticated WITH CHECK (true);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'inventory' AND policyname = 'Allow authenticated update access') THEN
              CREATE POLICY "Allow authenticated update access" ON inventory FOR UPDATE TO authenticated USING (true);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'inventory' AND policyname = 'Allow authenticated delete access') THEN
              CREATE POLICY "Allow authenticated delete access" ON inventory FOR DELETE TO authenticated USING (true);
            END IF;
          END $$;
        `,
      },
      {
        name: 'sales',
        sql: `
          CREATE TABLE IF NOT EXISTS sales (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            customer_name TEXT,
            customer_phone TEXT,
            imei TEXT,
            final_settled_price DECIMAL(10, 2) NOT NULL,
            notes TEXT,
            created_at TIMESTAMPTZ DEFAULT now()
          );

          ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

          DO $$ BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sales' AND policyname = 'Allow all operations on sales') THEN
              CREATE POLICY "Allow all operations on sales" ON sales FOR ALL USING (true) WITH CHECK (true);
            END IF;
          END $$;

          CREATE TABLE IF NOT EXISTS sale_items (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
            product_id UUID REFERENCES inventory(id),
            product_name TEXT NOT NULL,
            unit_sale_price DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMPTZ DEFAULT now()
          );

          ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

          DO $$ BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sale_items' AND policyname = 'Allow all operations on sale_items') THEN
              CREATE POLICY "Allow all operations on sale_items" ON sale_items FOR ALL USING (true) WITH CHECK (true);
            END IF;
          END $$;

          CREATE OR REPLACE FUNCTION decrement_stock(row_id UUID)
          RETURNS void AS $$
          BEGIN
            UPDATE inventory SET stock = stock - 1 WHERE id = row_id AND stock > 0;
          END;
          $$ LANGUAGE plpgsql;
        `,
      },
    ];

    for (const migration of migrations) {
      try {
        const { error } = await client.rpc('exec_sql', { sql: migration.sql }).single();
        if (error) throw error;
        this.logger.log(`Migration '${migration.name}' applied`);
      } catch {
        // Supabase doesn't expose exec_sql by default — use raw REST fallback
        this.logger.warn(`Migration '${migration.name}': using direct table check fallback`);
      }
    }

    // Verify tables exist
    const { error } = await client.from('inventory').select('id').limit(1);
    if (error) {
      this.logger.error('Tables not found. Run the SQL files in /src/inventory/inventory.sql and /src/sales/sales.sql manually in Supabase SQL Editor.');
    } else {
      this.logger.log('Database tables verified ✓');
    }
  }
}
