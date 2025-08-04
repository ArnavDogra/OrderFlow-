export interface Order {
  id: string;
  orderId: string;
  customerName: string;
  orderAmount: string;
  orderDate: string;
  invoiceFileUrl?: string;
  createdAt: string;
}

export interface CreateOrderData {
  customerName: string;
  orderAmount: number;
  orderDate: string;
  invoiceFile?: File;
}

export interface OrderStats {
  totalOrders: number;
  monthlyOrders: number;
  revenue: string;
  pendingOrders: number;
}
