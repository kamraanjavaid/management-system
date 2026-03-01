import { Sale, CreateSaleDto } from '../types/sales-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class SalesService {
  private getHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async createSale(saleData: CreateSaleDto): Promise<Sale> {
    const response = await fetch(`${API_URL}/api/sales`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(saleData),
    });
    if (!response.ok) throw new Error('Failed to create sale');
    return response.json();
  }

  async getAllSales(): Promise<Sale[]> {
    const response = await fetch(`${API_URL}/api/sales`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch sales');
    return response.json();
  }

  async getSaleById(id: string): Promise<Sale> {
    const response = await fetch(`${API_URL}/api/sales/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch sale');
    return response.json();
  }
}

export const salesService = new SalesService();