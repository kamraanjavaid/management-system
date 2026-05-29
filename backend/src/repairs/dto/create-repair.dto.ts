import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateRepairDto {
  @IsString() @IsNotEmpty() customerName: string;
  @IsString() @IsNotEmpty() customerPhone: string;
  @IsString() @IsNotEmpty() deviceModel: string;
  @IsString() @IsOptional() imei?: string;
  @IsString() @IsNotEmpty() issueDescription: string;
  @IsNumber() estimatedCost: number;
  @IsString() @IsOptional() notes?: string;
}
