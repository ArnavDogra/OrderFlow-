import { apiRequest } from "@/lib/queryClient";
import { CreateOrderData, Order } from "@/types/order";

export const orderApi = {
  createOrder: async (data: CreateOrderData): Promise<Order> => {
    const formData = new FormData();
    formData.append('customerName', data.customerName);
    formData.append('orderAmount', data.orderAmount.toString());
    formData.append('orderDate', data.orderDate);
    
    if (data.invoiceFile) {
      formData.append('invoiceFile', data.invoiceFile);
    }

    const response = await fetch('/api/orders', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create order');
    }

    return response.json();
  },

  getOrders: async (): Promise<Order[]> => {
    const response = await apiRequest('GET', '/api/orders');
    return response.json();
  },

  getOrder: async (id: string): Promise<Order> => {
    const response = await apiRequest('GET', `/api/orders/${id}`);
    return response.json();
  },
};
