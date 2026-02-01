const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  stock: number;
  cost_price: number;
  sale_price: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductDto {
  name: string;
  brand: string;
  category: string;
  stock: number;
  cost_price: number;
  sale_price: number;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

class InventoryService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getAllProducts(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/inventory`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    return response.json();
  }

  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${API_URL}/inventory/${id}`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    
    return response.json();
  }

  async createProduct(product: CreateProductDto): Promise<Product> {
    const response = await fetch(`${API_URL}/inventory`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(product),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create product');
    }
    
    return response.json();
  }

  async updateProduct(id: string, product: UpdateProductDto): Promise<Product> {
    const response = await fetch(`${API_URL}/inventory/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(product),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update product');
    }
    
    return response.json();
  }

  async deleteProduct(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/inventory/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
  }

  async updateStock(id: string, change: number): Promise<Product> {
    const response = await fetch(`${API_URL}/inventory/${id}/stock`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ change }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update stock');
    }
    
    return response.json();
  }
}

export const inventoryService = new InventoryService();