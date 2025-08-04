import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema } from "@shared/schema";
import { s3Service, snsService } from "./services/aws-mock";
import multer from "multer";
import { z } from "zod";

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // POST /api/orders - Create new order
  app.post("/api/orders", upload.single('invoiceFile'), async (req, res) => {
    try {
      // Validate request body
      const orderData = insertOrderSchema.parse({
        customerName: req.body.customerName,
        orderAmount: parseFloat(req.body.orderAmount),
        orderDate: req.body.orderDate,
      });

      // Create order
      const order = await storage.createOrder(orderData);
      
      // Handle file upload if present
      let invoiceFileUrl = null;
      if (req.file) {
        try {
          invoiceFileUrl = await s3Service.uploadFile(req.file, order.orderId);
          // Update order with invoice URL
          // In a real implementation, you'd update the database here
          console.log(`Invoice uploaded for order ${order.orderId}: ${invoiceFileUrl}`);
        } catch (uploadError) {
          console.error('File upload failed:', uploadError);
          // Continue without failing the order creation
        }
      }

      // Send SNS notification
      try {
        await snsService.publishOrderCreated({
          ...order,
          invoiceFileUrl,
        });
      } catch (snsError) {
        console.error('SNS notification failed:', snsError);
        // Continue without failing the order creation
      }

      res.status(201).json({
        ...order,
        invoiceFileUrl,
        message: "Order created successfully"
      });
    } catch (error) {
      console.error('Order creation failed:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      } else if (error instanceof multer.MulterError) {
        res.status(400).json({ 
          message: "File upload error", 
          error: error.message 
        });
      } else {
        res.status(500).json({ 
          message: "Internal server error" 
        });
      }
    }
  });

  // GET /api/orders/:id - Get order by ID
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Try to find by UUID first, then by orderId
      let order = await storage.getOrder(id);
      if (!order) {
        order = await storage.getOrderByOrderId(id);
      }
      
      if (!order) {
        return res.status(404).json({ 
          message: "Order not found" 
        });
      }

      res.json(order);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      res.status(500).json({ 
        message: "Internal server error" 
      });
    }
  });

  // GET /api/orders - Get all orders
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      res.status(500).json({ 
        message: "Internal server error" 
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      services: {
        database: "connected",
        s3: "mock",
        sns: "mock"
      }
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
