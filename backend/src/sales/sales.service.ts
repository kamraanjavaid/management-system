import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Sale } from './interfaces/sales.interface';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class SalesService {
  constructor(private supabaseService: SupabaseService) {}

  async create(dto: CreateSaleDto): Promise<Sale> {
    const client = this.supabaseService.getClient();

    // 1. Insert Main Sale
    const { data: saleData, error: saleError } = await client
      .from('sales')
      .insert({
        customer_name: dto.customerName,
        customer_phone: dto.customerPhone,
        imei: dto.imei,
        final_settled_price: dto.finalPrice,
        notes: dto.notes,
      })
      .select()
      .single();

    if (saleError) throw new BadRequestException(saleError.message);

    // 2. Prepare and Insert Items (only if items exist)
    if (dto.items && dto.items.length > 0) {
      const itemsToInsert = dto.items.map(item => ({
        sale_id: saleData.id,
        product_id: item.productId,
        product_name: item.name,
        unit_sale_price: item.price
      }));

      const { error: itemsError } = await client.from('sale_items').insert(itemsToInsert);
      if (itemsError) throw new BadRequestException(`Failed to log items: ${itemsError.message}`);

      // 3. Decrement Inventory Stock
      for (const item of dto.items) {
        const { error: rpcError } = await client.rpc('decrement_stock', { row_id: item.productId });
        if (rpcError) console.error(`Stock update failed for ${item.productId}:`, rpcError.message);
      }
    }

    return saleData;
  }

  async findAll(): Promise<Sale[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('sales')
      .select('*, items:sale_items(*)')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }

  async findOne(id: string): Promise<Sale> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('sales')
      .select('*, items:sale_items(*)')
      .eq('id', id)
      .single();

    if (error) throw new BadRequestException('Sale not found');
    return data;
  }
}