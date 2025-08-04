import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, RotateCcw, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import FileUpload from "@/components/ui/file-upload";
import { useToast } from "@/hooks/use-toast";
import { orderApi } from "@/lib/api";
import { CreateOrderData } from "@/types/order";
import { Link, useLocation } from "wouter";

const createOrderSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  orderAmount: z.number().positive("Order amount must be positive"),
  orderDate: z.string().min(1, "Order date is required"),
});

type CreateOrderForm = z.infer<typeof createOrderSchema>;

export default function CreateOrder() {
  const [, setLocation] = useLocation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateOrderForm>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      customerName: "",
      orderAmount: 0,
      orderDate: new Date().toISOString().split('T')[0],
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: (data: CreateOrderData) => orderApi.createOrder(data),
    onSuccess: (newOrder) => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: "Success",
        description: `Order ${newOrder.orderId} created successfully!`,
      });
      setTimeout(() => setLocation('/'), 2000);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateOrderForm) => {
    createOrderMutation.mutate({
      ...data,
      invoiceFile: selectedFile || undefined,
    });
  };

  const resetForm = () => {
    form.reset();
    setSelectedFile(null);
  };

  const watchedValues = form.watch();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Create New Order</h1>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter customer name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="orderAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order Amount *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                className="pl-8"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="orderDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <Label>Invoice PDF Upload</Label>
                    <FileUpload
                      onFileSelect={setSelectedFile}
                      selectedFile={selectedFile}
                      accept=".pdf"
                      maxSize={10}
                    />
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      disabled={createOrderMutation.isPending}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      disabled={createOrderMutation.isPending}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {createOrderMutation.isPending ? "Creating..." : "Create Order"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Order ID</Label>
                <p className="text-sm">Will be generated automatically</p>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Customer</Label>
                <p className="text-sm">{watchedValues.customerName || "-"}</p>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Amount</Label>
                <p className="text-sm font-semibold">
                  ${watchedValues.orderAmount?.toFixed(2) || "0.00"}
                </p>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Date</Label>
                <p className="text-sm">
                  {watchedValues.orderDate ? new Date(watchedValues.orderDate).toLocaleDateString() : "-"}
                </p>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Invoice Status</Label>
                <div className="mt-1">
                  {selectedFile ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <Check className="h-3 w-3 mr-1" />
                      Uploaded
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Not uploaded</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-green-600">
                  <Check className="h-4 w-4 mr-2" />
                  Order will be saved to database
                </li>
                <li className="flex items-center text-green-600">
                  <Check className="h-4 w-4 mr-2" />
                  Invoice PDF uploaded to S3
                </li>
                <li className="flex items-center text-green-600">
                  <Check className="h-4 w-4 mr-2" />
                  SNS notification sent
                </li>
                <li className="flex items-center text-green-600">
                  <Check className="h-4 w-4 mr-2" />
                  Email confirmation dispatched
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
