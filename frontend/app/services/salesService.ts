import { Sale, CreateSaleDto } from '../types/sales-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class SalesService {
  private getHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async createSale(saleData: CreateSaleDto): Promise<Sale> {
    const response = await fetch(`${API_URL}/sales`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(saleData),
    });
    return response.json();
  }

  async getAllSales(): Promise<Sale[]> {
    const response = await fetch(`${API_URL}/sales`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async getSaleById(id: string): Promise<Sale> {
    const response = await fetch(`${API_URL}/sales/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return response.json();
  }
}

export const salesService = new SalesService();