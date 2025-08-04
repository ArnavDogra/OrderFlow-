import { orders, type Order, type InsertOrder } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrderByOrderId(orderId: string): Promise<Order | undefined>;
  getAllOrders(): Promise<Order[]>;
  
  // Users (existing)
  getUser(id: string): Promise<any>;
  getUserByUsername(username: string): Promise<any>;
  createUser(user: any): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    // Generate a unique order ID (ORD-XXXXX format)
    const orderNumber = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
    const orderId = `ORD-${orderNumber}`;
    
    const [order] = await db
      .insert(orders)
      .values({
        customerName: insertOrder.customerName,
        orderAmount: insertOrder.orderAmount.toString(),
        orderDate: new Date(insertOrder.orderDate),
        invoiceFileUrl: insertOrder.invoiceFileUrl,
        orderId,
      })
      .returning();
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrderByOrderId(orderId: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.orderId, orderId));
    return order;
  }

  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  // Existing user methods (keeping for compatibility)
  async getUser(id: string): Promise<any> {
    return undefined;
  }

  async getUserByUsername(username: string): Promise<any> {
    return undefined;
  }

  async createUser(user: any): Promise<any> {
    return user;
  }
}

export const storage = new DatabaseStorage();
