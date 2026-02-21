import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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

@Injectable()
export class InventoryService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { total_stock_cost, cost_price, stock, ...rest } = createProductDto;

    let calculatedUnitCost = cost_price || 0;

    // Logic: If user provides total stock price, calculate per-unit cost
    if (total_stock_cost && stock > 0) {
      calculatedUnitCost = total_stock_cost / stock;
    }

    const product = {
      ...rest,
      name: rest.name,
      brand: rest.brand || '',
      category: rest.category,
      stock,
      cost_price: calculatedUnitCost,
      sale_price: createProductDto.sale_price,
    };

    const { data, error } = await this.supabaseService
      .getClient()
      .from('inventory')
      .insert(product)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }

    return data;
  }

  async findAll(): Promise<Product[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch inventory: ${error.message}`);
    }

    return data || [];
  }

  async findOne(id: string): Promise<Product> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('inventory')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return data;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('inventory')
      .update(updateProductDto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }

    if (!data) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return data;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const { error } = await this.supabaseService
      .getClient()
      .from('inventory')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }

    return { deleted: true };
  }

  async updateStock(id: string, stockChange: number): Promise<Product> {
    // Get current product
    const product = await this.findOne(id);
    
    const newStock = product.stock + stockChange;
    if (newStock < 0) {
      throw new Error('Insufficient stock');
    }

    return this.update(id, { stock: newStock });
  }
}
