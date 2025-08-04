import { randomUUID } from "crypto";

// Mock AWS S3 Service
export class MockS3Service {
  private bucket = "order-management-invoices";
  
  async uploadFile(file: Express.Multer.File, orderId: string): Promise<string> {
    // Simulate S3 upload delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate mock S3 URL
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `invoices/${orderId}_${randomUUID()}.${fileExtension}`;
    const mockS3Url = `https://${this.bucket}.s3.amazonaws.com/${fileName}`;
    
    console.log(`[MOCK S3] Uploaded file: ${file.originalname} -> ${mockS3Url}`);
    return mockS3Url;
  }
}

// Mock AWS SNS Service
export class MockSNSService {
  private topicArn = "arn:aws:sns:us-east-1:123456789:order-notifications";
  
  async publishOrderCreated(order: any): Promise<void> {
    // Simulate SNS publish delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const message = {
      orderId: order.orderId,
      customerName: order.customerName,
      orderAmount: order.orderAmount,
      timestamp: new Date().toISOString(),
    };
    
    console.log(`[MOCK SNS] Published to ${this.topicArn}:`, message);
    
    // Simulate email/SMS notification
    console.log(`[MOCK EMAIL] Order confirmation sent to customer: ${order.customerName}`);
  }
}

export const s3Service = new MockS3Service();
export const snsService = new MockSNSService();
