import { Repair, CreateRepairDto, UpdateRepairDto } from '../types/repair-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class RepairsService {
  private getHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async createRepair(dto: CreateRepairDto): Promise<Repair> {
    const res = await fetch(`${API_URL}/api/repairs`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error('Failed to create repair job');
    return res.json();
  }

  async getAllRepairs(): Promise<Repair[]> {
    const res = await fetch(`${API_URL}/api/repairs`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch repairs');
    return res.json();
  }

  async getRepairById(id: string): Promise<Repair> {
    const res = await fetch(`${API_URL}/api/repairs/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch repair');
    return res.json();
  }

  async updateRepair(id: string, dto: UpdateRepairDto): Promise<Repair> {
    const res = await fetch(`${API_URL}/api/repairs/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error('Failed to update repair');
    return res.json();
  }

  async deleteRepair(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/api/repairs/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete repair');
  }
}

export const repairsService = new RepairsService();
