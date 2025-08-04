import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import Dashboard from "@/pages/dashboard";
import CreateOrder from "@/pages/create-order";
import OrderDetail from "@/pages/order-detail";
import OrdersList from "@/pages/orders-list";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/create" component={CreateOrder} />
      <Route path="/orders" component={OrdersList} />
      <Route path="/orders/:id" component={OrderDetail} />
      <Route path="/analytics" component={() => <div className="p-8">Analytics page coming soon...</div>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex">
            <div className="w-64 flex-shrink-0">
              <Sidebar />
            </div>
            <div className="flex-1">
              <Router />
            </div>
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
