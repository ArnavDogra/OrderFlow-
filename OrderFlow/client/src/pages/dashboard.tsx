import { useQuery } from "@tanstack/react-query";
import { ShoppingCart, Calendar, DollarSign, Clock, Eye, Edit, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatsCard from "@/components/ui/stats-card";
import { orderApi } from "@/lib/api";
import { Order } from "@/types/order";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['/api/orders'],
    queryFn: orderApi.getOrders,
  });

  // Calculate stats
  const totalOrders = orders.length;
  const monthlyOrders = orders.filter(order => {
    const orderDate = new Date(order.orderDate);
    const now = new Date();
    return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
  }).length;
  
  const revenue = orders.reduce((sum, order) => sum + parseFloat(order.orderAmount), 0);
  const pendingOrders = orders.filter(order => Math.random() > 0.8).length; // Mock pending logic

  // Recent orders (latest 10)
  const recentOrders = orders.slice(0, 10);

  if (isLoading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Orders"
          value={totalOrders.toLocaleString()}
          icon={ShoppingCart}
          variant="primary"
        />
        <StatsCard
          title="This Month"
          value={monthlyOrders}
          icon={Calendar}
        />
        <StatsCard
          title="Revenue"
          value={`$${revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
        />
        <StatsCard
          title="Pending"
          value={pendingOrders}
          icon={Clock}
        />
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No orders found. Create your first order to get started.</p>
              <Link href="/create">
                <Button className="mt-4">Create Order</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Badge variant="secondary">{order.orderId}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{order.customerName}</TableCell>
                    <TableCell className="font-semibold">
                      ${parseFloat(order.orderAmount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {order.invoiceFileUrl ? (
                        <Button variant="outline" size="sm" asChild>
                          <a href={order.invoiceFileUrl} target="_blank" rel="noopener noreferrer">
                            Download
                          </a>
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">No invoice</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/orders/${order.orderId}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
