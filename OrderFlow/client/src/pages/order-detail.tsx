import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Edit, Download, Copy, Undo, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { orderApi } from "@/lib/api";
import { Link, useParams } from "wouter";

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  
  const { data: order, isLoading, error } = useQuery({
    queryKey: ['/api/orders', id],
    queryFn: () => orderApi.getOrder(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="p-8 text-center">Loading order details...</div>;
  }

  if (error || !order) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Order Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The order you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const orderDate = new Date(order.orderDate);
  const createdAt = new Date(order.createdAt);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Order Details</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Order
          </Button>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Order Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Order #{order.orderId}</CardTitle>
                <Badge className="bg-green-100 text-green-800">Completed</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h6 className="text-sm font-medium text-muted-foreground mb-3">Customer Information</h6>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Name: </span>
                      <span>{order.customerName}</span>
                    </div>
                    <div>
                      <span className="font-medium">Order Date: </span>
                      <span>{orderDate.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div>
                      <span className="font-medium">Order ID: </span>
                      <span>{order.orderId}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h6 className="text-sm font-medium text-muted-foreground mb-3">Order Summary</h6>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Amount: </span>
                      <span className="text-green-600 font-semibold">
                        ${parseFloat(order.orderAmount).toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Currency: </span>
                      <span>USD</span>
                    </div>
                    <div>
                      <span className="font-medium">Payment Status: </span>
                      <Badge className="bg-green-100 text-green-800">Paid</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h6 className="font-medium">Order Created</h6>
                    <p className="text-sm text-muted-foreground">
                      {createdAt.toLocaleDateString()} at {createdAt.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h6 className="font-medium">Invoice Generated</h6>
                    <p className="text-sm text-muted-foreground">
                      {createdAt.toLocaleDateString()} at {new Date(createdAt.getTime() + 60000).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h6 className="font-medium">Payment Processed</h6>
                    <p className="text-sm text-muted-foreground">
                      {createdAt.toLocaleDateString()} at {new Date(createdAt.getTime() + 900000).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h6 className="font-medium">Order Completed</h6>
                    <p className="text-sm text-muted-foreground">
                      {createdAt.toLocaleDateString()} at {new Date(createdAt.getTime() + 1800000).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Invoice & Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Invoice & Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {order.invoiceFileUrl ? (
                <>
                  <div className="flex items-center p-3 border rounded-lg mb-4">
                    <div className="flex-1">
                      <h6 className="font-medium">invoice_{order.orderId}.pdf</h6>
                      <p className="text-sm text-muted-foreground">PDF Document</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={order.invoiceFileUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                  <Button className="w-full" asChild>
                    <a href={order.invoiceFileUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Download Invoice
                    </a>
                  </Button>
                </>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No invoice available for this order</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Copy className="h-4 w-4 mr-2" />
                Duplicate Order
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Undo className="h-4 w-4 mr-2" />
                Process Refund
              </Button>
              <Button variant="destructive" className="w-full justify-start">
                <X className="h-4 w-4 mr-2" />
                Cancel Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
