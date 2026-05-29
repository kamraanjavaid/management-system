import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import type { RepairStatus } from '../interfaces/repair.interface';

export class UpdateRepairDto {
  @IsEnum(['Pending', 'In-Repair', 'Ready', 'Delivered']) @IsOptional() status?: RepairStatus;
  @IsNumber() @IsOptional() finalCost?: number;
  @IsString() @IsOptional() notes?: string;
}
