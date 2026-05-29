import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Repair } from './interfaces/repair.interface';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';

@Injectable()
export class RepairsService {
  constructor(private supabaseService: SupabaseService) {}

  async create(dto: CreateRepairDto): Promise<Repair> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('repairs')
      .insert({
        customer_name: dto.customerName,
        customer_phone: dto.customerPhone,
        device_model: dto.deviceModel,
        imei: dto.imei,
        issue_description: dto.issueDescription,
        estimated_cost: dto.estimatedCost,
        notes: dto.notes,
      })
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findAll(): Promise<Repair[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('repairs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new BadRequestException(error.message);
    return data || [];
  }

  async findOne(id: string): Promise<Repair> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('repairs')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Repair job not found');
    return data;
  }

  async update(id: string, dto: UpdateRepairDto): Promise<Repair> {
    const updatePayload: any = { updated_at: new Date().toISOString() };
    if (dto.status !== undefined) updatePayload.status = dto.status;
    if (dto.finalCost !== undefined) updatePayload.final_cost = dto.finalCost;
    if (dto.notes !== undefined) updatePayload.notes = dto.notes;

    const { data, error } = await this.supabaseService
      .getClient()
      .from('repairs')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    if (!data) throw new NotFoundException('Repair job not found');
    return data;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const { error } = await this.supabaseService
      .getClient()
      .from('repairs')
      .delete()
      .eq('id', id);

    if (error) throw new BadRequestException(error.message);
    return { deleted: true };
  }
}
