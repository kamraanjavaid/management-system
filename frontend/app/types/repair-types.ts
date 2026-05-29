export type RepairStatus = 'Pending' | 'In-Repair' | 'Ready' | 'Delivered';

export interface Repair {
  id: string;
  customer_name: string;
  customer_phone: string;
  device_model: string;
  imei?: string;
  issue_description: string;
  estimated_cost: number;
  final_cost?: number;
  status: RepairStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRepairDto {
  customerName: string;
  customerPhone: string;
  deviceModel: string;
  imei?: string;
  issueDescription: string;
  estimatedCost: number;
  notes?: string;
}

export interface UpdateRepairDto {
  status?: RepairStatus;
  finalCost?: number;
  notes?: string;
}
