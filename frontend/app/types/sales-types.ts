export interface SaleItem {
id: string;
sale_id: string;
product_id: string;
product_name: string;
unit_sale_price: number;
}

export interface Sale {
id: string;
customer_name: string | null;
customer_phone: string | null;
imei: string;
final_settled_price: number;
notes: string | null;
created_at: string;
items?: SaleItem[];
}

export interface SaleItemDto {
productId: string;
name: string;
price: number;
}

export interface CreateSaleDto {
customerName?: string;
customerPhone?: string;
imei: string;
finalPrice: number;
notes?: string;
items?: SaleItemDto[];
}